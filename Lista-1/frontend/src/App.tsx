import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { GamesList } from "./pages/games-list";
import { Game } from "./pages/game";
import "./App.css";
import { Toaster } from "react-hot-toast";

export const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games-list" element={<GamesList />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
    <Toaster position="bottom-right" reverseOrder={false} />
  </>
);
