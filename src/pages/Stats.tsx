import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Layout from "@/components/Layout";
import "../App.css";
import { brainRegionAnswersAtom } from "../store/brainCheckupStore";
import { Progress } from "@/components/ui/progress"

function Stats() {
  const navigate = useNavigate();
  const [brainRegionAnswers] = useAtom(brainRegionAnswersAtom);

 const regionSums: Record<string, number> = {};

  Object.entries(brainRegionAnswers).forEach(([region, answers]) => {
    regionSums[region] = answers.reduce(
      (sum: number, answer: number) => sum + answer,
      0
    );
  });

  console.log("Region sums:", regionSums);

  return (
    <Layout>
       <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center">
          
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold pb-8 tracking-tight bg-clip-text text-primary">
                Statistics
            </h1>
          </header>
          
          <div className="flex flex-col items-center justify-center space-y-8">
          {Object.entries(regionSums).map(([region, sum]) => (
            <div key={region} className="w-[calc(90vh)]">
              <h2 className="mb-2 font-semibold capitalize">{region}</h2>
              <Progress value={(sum / 10) * 100} />
            </div>
          ))}
          </div>
      </div>
    </Layout>
  );
}

export default Stats;