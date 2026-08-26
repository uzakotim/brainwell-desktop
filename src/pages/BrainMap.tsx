import { useNavigate } from "react-router-dom";
import { useSetAtom } from 'jotai';
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import "../App.css";
import { questions } from "../data/Questions";
import { PiBrainThin } from "react-icons/pi";


import {
  brainRegionQuestionsAtom,
  brainRegionAnswersAtom,
  getRandomQuestions
} from "../store/brainCheckupStore";

function BrainMap() {
  const navigate = useNavigate();
  const setQuestions = useSetAtom(brainRegionQuestionsAtom);
  const setAnswers = useSetAtom(brainRegionAnswersAtom);

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
              Select a brain region to explore the questions and insights associated
              with it.
            </p>
          </div>

          {/* Brain map */}
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="grid w-full max-w-4xl grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-8">

              {/* Left regions */}
              <div className="flex flex-col gap-2 md:gap-3">
                {[
                  {
                    name: "PFC",
                    description: "Decision making",
                  },
                  {
                    name: "Hippocampus",
                    description: "Memory & learning",
                  },
                  {
                    name: "Cortisol",
                    description: "Stress response",
                  },
                ].map((region) => (
                  <button
                    key={region.name}
                    onClick={() => navigate(`/brain-region/${region.name}`)}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-2.5 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 md:px-4 md:py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {region.name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {region.description}
                      </div>
                    </div>

                    <span className="ml-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary">
                      →
                    </span>
                  </button>
                ))}
              </div>

              {/* Brain */}
              <div className="flex items-center justify-center py-2 md:py-0">
                <div className="relative flex size-[min(42vw,40vh)] max-h-72 max-w-72 items-center justify-center rounded-full border border-border/40 bg-card/40 shadow-inner backdrop-blur-sm">

                  <div className="absolute inset-[8%] rounded-full border border-primary/10" />
                  <div className="absolute inset-[16%] rounded-full border border-primary/5" />

                  <PiBrainThin
                    className="size-[65%] text-primary transition-transform duration-500 hover:scale-105"
                    strokeWidth={1}
                  />
                </div>
              </div>

              {/* Right regions */}
              <div className="flex flex-col gap-2 md:gap-3">
                {[
                  {
                    name: "Amygdala",
                    description: "Emotion & fear",
                  },
                  {
                    name: "ACC",
                    description: "Attention & control",
                  },
                ].map((region) => (
                  <button
                    key={region.name}
                    onClick={() => navigate(`/brain-region/${region.name}`)}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-2.5 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 md:px-4 md:py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {region.name}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {region.description}
                      </div>
                    </div>

                    <span className="ml-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-4 shrink-0 flex flex-col items-center justify-center gap-2 pb-1 sm:flex-row">
            <Button
              onClick={handleRandomize}
              className="h-10 w-full px-6 shadow-sm sm:w-auto"
            >
              Randomize questions
            </Button>

            <Button
              onClick={() => navigate("/stats")}
              variant="outline"
              className="h-10 w-full px-6 sm:w-auto"
            >
              View statistics
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BrainMap;
