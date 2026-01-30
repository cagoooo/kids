import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

// Lazy Load Pages
const Home = lazy(() => import("@/pages/Home"));
const ColorGame = lazy(() => import("@/pages/ColorGame"));
const MathGame = lazy(() => import("@/pages/MathGame"));
const EnglishGame = lazy(() => import("@/pages/EnglishGame"));
const ShapeGame = lazy(() => import("@/pages/ShapeGame"));
const RhythmGame = lazy(() => import("@/pages/RhythmGame"));
const ClockGame = lazy(() => import("@/pages/ClockGame"));
const BopomofoGame = lazy(() => import("@/pages/BopomofoGame"));
const EmotionGame = lazy(() => import("@/pages/EmotionGame"));
const CodingGame = lazy(() => import("@/pages/CodingGame"));
const GardenGame = lazy(() => import("@/pages/GardenGame"));
const MarketGame = lazy(() => import("@/pages/MarketGame"));
const RecycleGame = lazy(() => import("@/pages/RecycleGame"));
const MemoryGame = lazy(() => import("@/pages/MemoryGame"));
const AnimalGame = lazy(() => import("@/pages/AnimalGame"));
const TrafficGame = lazy(() => import("@/pages/TrafficGame"));
const BodyGame = lazy(() => import("@/pages/BodyGame"));
const FoodGame = lazy(() => import("@/pages/FoodGame"));
const JobGame = lazy(() => import("@/pages/JobGame"));
const PuzzleGame = lazy(() => import("@/pages/PuzzleGame"));
const DifferenceGame = lazy(() => import("@/pages/DifferenceGame"));
const SequenceGame = lazy(() => import("@/pages/SequenceGame"));
const SortingGame = lazy(() => import("@/pages/SortingGame"));
const Scores = lazy(() => import("@/pages/Scores"));
const Stickers = lazy(() => import("@/pages/Stickers"));
const Certificates = lazy(() => import("@/pages/Certificates"));
const DailyChallenge = lazy(() => import("@/pages/DailyChallenge"));
const DrawingGame = lazy(() => import("@/pages/DrawingGame"));
const MoleGame = lazy(() => import("@/pages/MoleGame"));
const Shop = lazy(() => import("@/pages/Shop"));

function Router() {
  // Use the base path from Vite config in production
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--macaron-yellow))]">
        <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--macaron-purple-dark))]" />
      </div>
    }>
      <Switch>
        <Route path={base + "/"} component={Home} />
        <Route path={base + "/scores"} component={Scores} />
        <Route path={base + "/stickers"} component={Stickers} />
        <Route path={base + "/daily"} component={DailyChallenge} />
        <Route path={base + "/shop"} component={Shop} />
        <Route path={base + "/game/color"} component={ColorGame} />
        <Route path={base + "/game/math"} component={MathGame} />
        <Route path={base + "/game/english"} component={EnglishGame} />
        <Route path={base + "/game/shape"} component={ShapeGame} />
        <Route path={base + "/game/melody"} component={RhythmGame} />
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
        <Route path={base + "/game/drawing"} component={DrawingGame} />
        <Route path={base + "/game/mole"} component={MoleGame} />
        <Route path={base + "/certificates"} component={Certificates} />

        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

import { useAuth } from "@/hooks/use-auth";

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
import { StickerProvider } from "@/hooks/use-sticker-context";

import { DailyChallengeProvider } from "@/hooks/use-daily-challenge";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SoundProvider>
          <UserProvider>
            <StickerProvider>
              <DailyChallengeProvider>
                <AuthWrapper>
                  <ErrorBoundary>
                    <Router />
                  </ErrorBoundary>
                </AuthWrapper>
              </DailyChallengeProvider>
            </StickerProvider>
          </UserProvider>
        </SoundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
