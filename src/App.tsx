import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrainMap from "./pages/BrainMap";
import BrainRegion from "./pages/BrainRegion";
import "./App.css";
import Stats from "./pages/Stats";
import { Charts } from "./pages/Charts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/brain-map" element={<BrainMap />} />
      <Route path="/brain-region/:region" element={<BrainRegion />} />
      <Route path="/stats" element={<Stats/>}/>
      <Route path="/charts" element={<Charts region="PFC"/>}/>
    </Routes>
  );
}

export default App;
