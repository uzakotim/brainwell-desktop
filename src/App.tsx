import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrainMap from "./pages/BrainMap";
import BrainRegion from "./pages/BrainRegion";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/brain-map" element={<BrainMap />} />
      <Route path="/brain-region/:region" element={<BrainRegion />} />
    </Routes>
  );
}

export default App;
