import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import UncoilingPage from "@/pages/UncoilingPage";
import AnnealingPage from "@/pages/AnnealingPage";
import GalvanizingPage from "@/pages/GalvanizingPage";
import AirKnifePage from "@/pages/AirKnifePage";
import CoolingPage from "@/pages/CoolingPage";
import PassivationPage from "@/pages/PassivationPage";
import CoilingPage from "@/pages/CoilingPage";
import QualityPage from "@/pages/QualityPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/uncoiling" element={<UncoilingPage />} />
          <Route path="/annealing" element={<AnnealingPage />} />
          <Route path="/galvanizing" element={<GalvanizingPage />} />
          <Route path="/air-knife" element={<AirKnifePage />} />
          <Route path="/cooling" element={<CoolingPage />} />
          <Route path="/passivation" element={<PassivationPage />} />
          <Route path="/coiling" element={<CoilingPage />} />
          <Route path="/quality" element={<QualityPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
