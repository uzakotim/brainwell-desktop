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
import { Brain } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="flex flex-row gap-20 justify-center items-center">
        {/* Left buttons */}
        <div className="flex flex-col gap-6">
            <Button
              key={"PFC"}
              onClick={() => navigate(`/brain-region/${"PFC"}`)}
              variant="outline"
            >
              {"PFC"}
            </Button>
            <Button
              key={"Hippocampus"}
              onClick={() => navigate(`/brain-region/${"Hippocampus"}`)}
              variant="outline"
            >
              {"Hippocampus"}
            </Button>
        </div>

        {/* Brain icon */}
          <PiBrainThin className="w-[35vh] h-[35vh] mr-8 text-primary" />

        {/* Right buttons */}
        <div className="flex flex-col gap-6">
            <Button
              key={"Amygdala"}
              onClick={() => navigate(`/brain-region/${"Amygdala"}`)}
              variant="outline"
            >
              {"Amygdala"}
            </Button>
            <Button
              key={"ACC"}
              onClick={() => navigate(`/brain-region/${"ACC"}`)}
              variant="outline"
            >
              {"ACC"}
            </Button>
        </div>
      </div>

  {/* Bottom buttons */}
  <Button onClick={handleRandomize} variant="default" className="mt-8">
    Randomize questions
  </Button>
  <Button onClick={() => navigate("/stats")} variant="default" className="mt-4">
    Statistics
  </Button>
</div>
    </Layout>
  );
}

export default BrainMap;
