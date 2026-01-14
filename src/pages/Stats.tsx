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
    await invoke("insert_record_to_store",{recordJson: JSON.stringify(record)});
    setConsoleMsg("Record saved!");
    setTimeout(() => {
      setConsoleMsg("");
    }, 3000);
  }
  return (
    <Layout>
       <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center space-y-8">
          {Object.entries(regionSums).map(([region, sum]) => (
            <div key={region} className="w-[calc(90vh)]">
              <h2 className="mb-2 font-semibold capitalize">{region}</h2>
              { (sum/10) * 100 >= 66 ? (
                 <Progress value={(sum / 10) * 100} barColor="bg-red-400" />
              ) :
               (sum/10) * 100 >= 33 ? (
                 <Progress value={(sum / 10) * 100} barColor="bg-amber-400" />
               )
               : (
                 <Progress value={(sum / 10) * 100} barColor="bg-green-500" />
               )
              }
            </div>
          ))}
          </div>
          <Button onClick={saveRecord} variant="default" className="mt-4">Save a record</Button>
          <p className="mt-4">{consoleMsg}</p>
      </div>
    </Layout>
  );
}

export default Stats;