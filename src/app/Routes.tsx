import { Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Leaderboard from "@/pages/LeaderBoard";
import Rules from "@/pages/Rules";

export function AppRouter() {
  return (
    <Routes>     
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/rules" element={<Rules />} />     
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
