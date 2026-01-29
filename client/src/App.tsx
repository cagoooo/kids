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
import CodingGame from "@/pages/CodingGame";
import GardenGame from "@/pages/GardenGame";
import MarketGame from "@/pages/MarketGame";
import RecycleGame from "@/pages/RecycleGame";
import MemoryGame from "@/pages/MemoryGame";
import AnimalGame from "@/pages/AnimalGame";
import TrafficGame from "@/pages/TrafficGame";
import BodyGame from "@/pages/BodyGame";
import FoodGame from "@/pages/FoodGame";
import JobGame from "@/pages/JobGame";
import PuzzleGame from "@/pages/PuzzleGame";
import DifferenceGame from "@/pages/DifferenceGame";
import SequenceGame from "@/pages/SequenceGame";
import SortingGame from "@/pages/SortingGame";
import Scores from "@/pages/Scores";
import Stickers from "@/pages/Stickers";
import Certificates from "@/pages/Certificates";

function Router() {
  // Use the base path from Vite config in production
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <Switch>
      <Route path={base + "/"} component={Home} />
      <Route path={base + "/scores"} component={Scores} />
      <Route path={base + "/stickers"} component={Stickers} />
      <Route path={base + "/game/color"} component={ColorGame} />
      <Route path={base + "/game/math"} component={MathGame} />
      <Route path={base + "/game/english"} component={EnglishGame} />
      <Route path={base + "/game/shape"} component={ShapeGame} />
      <Route path={base + "/game/melody"} component={MelodyGame} />
      <Route path={base + "/game/clock"} component={ClockGame} />
      <Route path={base + "/game/bopomofo"} component={BopomofoGame} />
      <Route path={base + "/game/emotion"} component={EmotionGame} />
      <Route path={base + "/game/coding"} component={CodingGame} />
      <Route path={base + "/game/garden"} component={GardenGame} />
      <Route path={base + "/game/market"} component={MarketGame} />
      <Route path={base + "/game/recycle"} component={RecycleGame} />
      <Route path={base + "/game/memory"} component={MemoryGame} />
      <Route path={base + "/game/animal"} component={AnimalGame} />
      <Route path={base + "/game/traffic"} component={TrafficGame} />
      <Route path={base + "/game/body"} component={BodyGame} />
      <Route path={base + "/game/food"} component={FoodGame} />
      <Route path={base + "/game/job"} component={JobGame} />
      <Route path={base + "/game/puzzle"} component={PuzzleGame} />
      <Route path={base + "/game/difference"} component={DifferenceGame} />
      <Route path={base + "/game/sequence"} component={SequenceGame} />
      <Route path={base + "/game/sorting"} component={SortingGame} />
      <Route path={base + "/certificates"} component={Certificates} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--macaron-yellow))]">
        <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--macaron-purple-dark))]" />
      </div>
    );
  }

  return <>{children}</>;
}

import { SoundProvider } from "@/hooks/use-sound-context";
import { UserProvider } from "@/hooks/use-user-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SoundProvider>
          <UserProvider>
            <AuthWrapper>
              <Router />
            </AuthWrapper>
          </UserProvider>
        </SoundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
