import { Button } from "@/components/ui/button";
import "../App.css";
import { questions } from "../data/Questions";


function BrainMap() {

  return ( 
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {Object.keys(questions.brain_checkup).map((region) => (
            <Button key={region} variant="outline" className="text-lg p-6">
              {region}
            </Button>
          ))}
      </div>

      <Button variant="default" className="mt-4">Get Started</Button>
    </div>  
  );
}

export default BrainMap;
