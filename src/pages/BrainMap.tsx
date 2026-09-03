import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import "../App.css";
import { questions } from "../data/Questions";
import { PiBrainThin } from "react-icons/pi";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";

import {
  brainRegionQuestionsAtom,
  brainRegionAnswersAtom,
  getRandomQuestions,
} from "../store/brainCheckupStore";

type StoreRecord = {
  date: string;
  dayTime: string;
  regionSums: Record<string, number>;
};

function BrainMap() {
  const navigate = useNavigate();

  const setQuestions = useSetAtom(brainRegionQuestionsAtom);
  const setAnswers = useSetAtom(brainRegionAnswersAtom);

  const [brainRegionAnswers] = useAtom(brainRegionAnswersAtom);

  // Today's saved regionSums (null = not yet loaded or none saved today)
  const [todayRecord, setTodayRecord] = useState<StoreRecord | null>(null);

  useEffect(() => {
    const loadTodayRecord = async () => {
      try {
        const storeJson: string = await invoke("load_store");
        const store: { records: StoreRecord[] } = JSON.parse(storeJson);
        const todayDate = new Date().toLocaleDateString("en-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        // Find the most recent record for today
        const todayRecords = store.records.filter((r) => r.date === todayDate);
        if (todayRecords.length > 0) {
          setTodayRecord(todayRecords[todayRecords.length - 1]);
        }
      } catch (e) {
        console.error("Failed to load store:", e);
      }
    };
    loadTodayRecord();
  }, []);

  const handleRandomize = () => {
    const newQuestions: Record<string, string[]> = {};
    const newAnswers: Record<string, number[]> = {};

    Object.entries(questions.brain_checkup).forEach(([key, data]) => {
      newQuestions[key] = getRandomQuestions(data.questions);
      newAnswers[key] = [0, 0, 0, 0, 0];
    });

    setQuestions(newQuestions);
    setAnswers(newAnswers);
  };

  // Use today's saved record when available, otherwise fall back to live answers
  const regionSums: Record<string, number> = todayRecord
    ? todayRecord.regionSums
    : Object.fromEntries(
        Object.entries(brainRegionAnswers).map(([region, answers]) => [
          region,
          answers.reduce((sum: number, answer: number) => sum + answer, 0),
        ])
      );

  const getPercentage = (region: string) => {
    const sum = regionSums[region] ?? 0;
    return Math.min((sum / 10) * 100, 100);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 66) return "text-red-400";
    if (percentage >= 33) return "text-amber-400";
    return "text-green-500";
  };

  const getRingColor = (percentage: number) => {
    if (percentage >= 66) return "stroke-red-400";
    if (percentage >= 33) return "stroke-amber-400";
    return "stroke-green-500";
  };
  const getHoverColor = (percentage: number) => {
    if (percentage >= 66) {
      return {
        border: "border-red-400/70",
        bg: "bg-red-400/5",
        text: "text-red-500 dark:text-red-400",
        ring: "ring-red-400/20",
      };
    }

    if (percentage >= 33) {
      return {
        border: "border-amber-400/70",
        bg: "bg-amber-400/5",
        text: "text-amber-500 dark:text-amber-400",
        ring: "ring-amber-400/20",
      };
    }

    return {
      border: "border-green-500/70",
      bg: "bg-green-500/5",
      text: "text-green-600 dark:text-green-400",
      ring: "ring-green-500/20",
    };
  };

  const saveRecord = async () => {
    const record = {
      date: new Date().toLocaleDateString("en-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      dayTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      regionSums,
    };

    await invoke("insert_record_to_store", {
      recordJson: JSON.stringify(record),
    });
  };

  const regions = [
    {
      name: "PFC",
      description: "Decision making",
      side: "left",
    },
    {
      name: "Hippocampus",
      description: "Memory & learning",
      side: "left",
    },
    {
      name: "Cortisol",
      description: "Stress response",
      side: "left",
    },
    {
      name: "Amygdala",
      description: "Emotion & fear",
      side: "right",
    },
    {
      name: "ACC",
      description: "Attention & control",
      side: "right",
    },
  ];

  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] overflow-hidden px-4 py-4 md:px-8">
        <div className="mx-auto flex h-full max-w-5xl flex-col">

          {/* Header */}
          <div className="shrink-0 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Explore your brain
            </h1>

            <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Select a brain region to explore your questions and see your
              current responses.
            </p>
          </div>

          {/* Brain map */}
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10">

              {/* Left regions */}
              <div className="flex flex-col gap-3">
                {regions
                  .filter((region) => region.side === "left")
                  .map((region) => {
                    const percentage = getPercentage(region.name);

                    return (
                      <RegionButton
                        key={region.name}
                        region={region}
                        percentage={percentage}
                        scoreColor={getScoreColor(percentage)}
                        hoverColor={getHoverColor(percentage)}
                        isHovered={hoveredRegion === region.name}
                        onClick={() =>
                          navigate(`/brain-region/${region.name}`)
                        }
                      />
                    );
                  })}
              </div>

              {/* Brain + statistics rings */}
              <div className="flex items-center justify-center py-4 md:py-0">
                <div className="relative flex size-[min(52vw,45vh)] max-h-80 max-w-80 items-center justify-center">

                  {/* Statistics rings */}
                  {[
                    "PFC",
                    "Hippocampus",
                    "Cortisol",
                    "Amygdala",
                    "ACC",
                  ].map((region, index) => {
                    const percentage = getPercentage(region);

                    const inset = index * 7;
                    const size = 100 - inset * 2;

                    const isHovered = hoveredRegion === region;

                    return (
                      <svg
                        key={region}
                        className="absolute cursor-pointer transition-all duration-200"
                        style={{
                          inset: `${inset}%`,
                          width: `${size}%`,
                          height: `${size}%`,
                          transform: "rotate(-90deg)",
                        }}
                        viewBox="0 0 100 100"
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                      >
                        {/* Background ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="47"
                          fill="none"
                          className="stroke-border/30"
                          strokeWidth={isHovered ? "1.8" : "1"}
                        />

                        {/* Progress ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="47"
                          fill="none"
                          className={getRingColor(percentage)}
                          strokeWidth={isHovered ? "3" : "1.8"}
                          strokeDasharray={`${percentage * 2.95} 295`}
                          strokeLinecap="round"
                          style={{
                            transition:
                              "stroke-dasharray 500ms ease, stroke-width 200ms ease",
                          }}
                        />
                      </svg>
                    );
                  })}

                  {/* Brain */}
                  <div className="relative flex size-[35%] items-center justify-center rounded-full bg-card shadow-inner">
                    <PiBrainThin
                      className="size-[70%] text-primary transition-transform duration-500 hover:scale-105"
                      strokeWidth={1}
                    />
                  </div>
                </div>
              </div>

              {/* Right regions */}
              <div className="flex flex-col gap-3">
                {regions
                  .filter((region) => region.side === "right")
                  .map((region) => {
                    const percentage = getPercentage(region.name);

                    return (
                      <RegionButton
                        key={region.name}
                        region={region}
                        percentage={percentage}
                        scoreColor={getScoreColor(percentage)}
                        hoverColor={getHoverColor(percentage)}
                        isHovered={hoveredRegion === region.name}
                        onClick={() =>
                          navigate(`/brain-region/${region.name}`)
                        }
                      />
                    );
                  })}
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="mb-4 shrink-0 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              onClick={handleRandomize}
              className="h-10 w-full px-6 shadow-sm sm:w-auto"
            >
              Randomize questions
            </Button>

            <Button
              onClick={saveRecord}
              variant="outline"
              className="h-10 w-full px-6 sm:w-auto"
            >
              Save a record
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}


/* Region button */
function RegionButton({
  region,
  percentage,
  scoreColor,
  hoverColor,
  isHovered,
  onClick,
}: {
  region: {
    name: string;
    description: string;
  };
  percentage: number;
  scoreColor: string;
  hoverColor: {
    border: string;
    bg: string;
    text: string;
    ring: string;
  };
  isHovered: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center justify-between rounded-xl
        border px-4 py-2.5 text-left
        shadow-sm backdrop-blur-sm
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/30
        md:px-4 md:py-3

        ${isHovered
          ? `${hoverColor.border} ${hoverColor.bg} shadow-md ring-1 ${hoverColor.ring}`
          : "border-border/60 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
        }
      `}
    >
      <div>
        <div
          className={`
            text-sm font-medium transition-colors duration-200
            ${isHovered
              ? hoverColor.text
              : "text-foreground"
            }
          `}
        >
          {region.name}
        </div>

        <div className="mt-0.5 text-xs text-muted-foreground">
          {region.description}
        </div>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <span className={`text-xs font-semibold ${scoreColor}`}>
          {Math.round(percentage)}%
        </span>

        <span
          className={`
            text-muted-foreground
            transition-all duration-200
            group-hover:translate-x-1
            group-hover:text-primary
            ${isHovered ? `translate-x-1 ${hoverColor.text}` : ""}
          `}
        >
          →
        </span>
      </div>
    </button>
  );
}
export default BrainMap;