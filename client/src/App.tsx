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
import Scores from "@/pages/Scores";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scores" component={Scores} />
      <Route path="/game/color" component={ColorGame} />
      <Route path="/game/math" component={MathGame} />
      <Route path="/game/english" component={EnglishGame} />
      
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
