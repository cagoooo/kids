import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import ColorGame from "@/pages/ColorGame";
import MathGame from "@/pages/MathGame";
import EnglishGame from "@/pages/EnglishGame";
import ShapeGame from "@/pages/ShapeGame";
import MelodyGame from "@/pages/MelodyGame";
import ClockGame from "@/pages/ClockGame";
import BopomofoGame from "@/pages/BopomofoGame";
import EmotionGame from "@/pages/EmotionGame";
import Scores from "@/pages/Scores";
import Stickers from "@/pages/Stickers";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scores" component={Scores} />
      <Route path="/stickers" component={Stickers} />
      <Route path="/game/color" component={ColorGame} />
      <Route path="/game/math" component={MathGame} />
      <Route path="/game/english" component={EnglishGame} />
      <Route path="/game/shape" component={ShapeGame} />
      <Route path="/game/melody" component={MelodyGame} />
      <Route path="/game/clock" component={ClockGame} />
      <Route path="/game/bopomofo" component={BopomofoGame} />
      <Route path="/game/emotion" component={EmotionGame} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
