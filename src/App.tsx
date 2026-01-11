import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BrainMap from "./pages/BrainMap";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/brain-map" element={<BrainMap />} />
    </Routes>
  );
}

export default App;
