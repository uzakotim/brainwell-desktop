import { useNavigate } from "react-router-dom";
import { useSetAtom } from 'jotai';
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import "../App.css";
import { questions } from "../data/Questions";
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
      <div className="flex flex-col gap-10 items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {Object.keys(questions.brain_checkup).map((region) => (
              <Button onClick={() => navigate(`/brain-region/${region}`)} key={region} variant="outline" className="text-lg p-6">
                {region}
              </Button>
            ))}
        </div>

        <Button onClick={handleRandomize} variant="default" className="mt-4">Randomize questions</Button>
      </div>  
    </Layout>
  );
}

export default BrainMap;
