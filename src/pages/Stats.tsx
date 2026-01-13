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
      </div>
    </Layout>
  );
}

export default Stats;