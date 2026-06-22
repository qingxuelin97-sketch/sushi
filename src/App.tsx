import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Chamber from "@/pages/Chamber";
import Members from "@/pages/Members";
import Agenda from "@/pages/Agenda";
import Division from "@/pages/Division";
import Hansard from "@/pages/Hansard";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import Rules from "@/pages/Rules";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chamber" element={<Chamber />} />
          <Route path="/members" element={<Members />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/division" element={<Division />} />
          <Route path="/hansard" element={<Hansard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
