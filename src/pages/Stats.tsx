import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Layout from "@/components/Layout";
import "../App.css";
import { brainRegionAnswersAtom } from "../store/brainCheckupStore";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";


function Stats() {
  const navigate = useNavigate();
  const [consoleMsg, setConsoleMsg] = useState("");
  const [brainRegionAnswers] = useAtom(brainRegionAnswersAtom);

  const regionSums: Record<string, number> = {};

  Object.entries(brainRegionAnswers).forEach(([region, answers]) => {
    regionSums[region] = answers.reduce(
      (sum: number, answer: number) => sum + answer,
      0
    );
  });

  console.log("Region sums:", regionSums);
  const saveRecord = async () => {
    const record = {
      // current date in format DD-MM-YYYY
      date: new Date().toLocaleDateString('en-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      regionSums,
    };
    setConsoleMsg("Saving...");
    await invoke("insert_record_to_store", { recordJson: JSON.stringify(record) });
    setConsoleMsg("Record saved!");
    setTimeout(() => {
      setConsoleMsg("");
    }, 3000);
  }
  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] overflow-hidden px-4 py-4 md:px-8">
        <div className="mx-auto flex h-full max-w-3xl flex-col">

          {/* Header */}
          <div className="shrink-0 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Your statistics
            </h1>

            <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
              See how your responses compare across different brain regions.
            </p>
          </div>

          {/* Statistics */}
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-2.5 py-4">
            {Object.entries(regionSums).map(([region, sum]) => {
              const percentage = Math.min((sum / 10) * 100, 100);

              const barColor =
                percentage >= 66
                  ? "bg-red-400"
                  : percentage >= 33
                    ? "bg-amber-400"
                    : "bg-green-500";

              return (
                <div
                  key={region}
                  className="rounded-xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-medium capitalize text-foreground">
                      {region}
                    </h2>

                    <span className="text-sm font-semibold text-muted-foreground">
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  <Progress
                    value={percentage}
                    barColor={barColor}
                  />
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="shrink-0 flex flex-col items-center justify-center gap-2 pb-1 sm:flex-row">
            <Button
              onClick={saveRecord}
              className="h-10 w-full px-6 shadow-sm sm:w-auto"
            >
              Save a record
            </Button>

            <Button
              onClick={() => navigate("/charts")}
              variant="outline"
              className="h-10 w-full px-6 sm:w-auto"
            >
              View charts
            </Button>
          </div>

          {/* Status */}
          <div className="h-5 shrink-0 text-center">
            {consoleMsg && (
              <p className="text-xs text-muted-foreground">
                {consoleMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Stats;