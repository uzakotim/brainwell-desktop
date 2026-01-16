import { Button } from "@/components/ui/button";
import "../App.css";
import { PiFlowerLotusDuotone } from "react-icons/pi";


function Home() {


  return ( 
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
      <div className="flex flex-col gap-2 items-center justify-center">
        <PiFlowerLotusDuotone className="w-16 h-16 text-green-600" />
        <h1 className=" text-4xl font-bold text-green-600">Brainwell</h1>
        <p className="text-md font-bold text-slate-800">This tool is educational and exploratory, not diagnostic.</p>
        {/* <p className="text-sm font-bold text-red-400">AI can make mistakes</p> */}
      </div>

      <Button onClick={() => window.location.href = "/brain-map"}  variant="default" className="mt-4">Get Started</Button>
    </div>  
  );
}

export default Home;
