import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "wouter";
import { useAddScore } from "@/hooks/use-scores";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GameShellProps {
  title: string;
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  gameType: "color" | "math" | "english";
  isGameOver: boolean;
  onRestart: () => void;
  colorClass: string;
  children: React.ReactNode;
}

export function GameShell({
  title,
  score,
  totalQuestions,
  currentQuestionIndex,
  gameType,
  isGameOver,
  onRestart,
  colorClass,
  children
}: GameShellProps) {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const addScore = useAddScore();

  useEffect(() => {
    if (isGameOver) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC0CB', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C']
      });
      // Delay showing the save dialog slightly
      const timer = setTimeout(() => setShowSaveDialog(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isGameOver]);

  const handleSaveScore = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    try {
      await addScore.mutateAsync({
        playerName,
        gameType,
        score
      });
      setShowSaveDialog(false);
      onRestart(); // Or navigate away
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-[80vh] flex flex-col ${colorClass} rounded-[3rem] p-4 md:p-8 shadow-xl relative overflow-hidden border-8 border-white`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Star className="w-64 h-64 fill-current" />
      </div>

      {/* Game Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <Link href="/">
          <button 
            className="bg-white/40 hover:bg-white/60 p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 text-inherit"
            data-testid="button-back"
          >
            <ArrowLeft className="w-8 h-8 stroke-[3]" />
          </button>
        </Link>
        
        <div className="flex flex-col items-center">
          <h2 className="font-display text-3xl font-bold text-shadow">{title}</h2>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  i < currentQuestionIndex ? "bg-white" : "bg-black/10"
                }`} 
              />
            ))}
          </div>
        </div>

        <div className="bg-white/40 px-6 py-2 rounded-2xl font-display font-bold text-2xl flex items-center gap-2">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-500" />
          {score}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {!isGameOver ? (
            children
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center gap-6 py-10"
            >
              <h1 className="font-display text-6xl font-black text-white text-shadow-lg">
                太棒了！
              </h1>
              <div className="bg-white/30 backdrop-blur-md p-8 rounded-3xl w-full max-w-md">
                <p className="text-2xl font-bold mb-2">最終得分</p>
                <div className="text-8xl font-black text-white text-shadow-lg mb-4">
                  {score}
                </div>
                <button 
                  onClick={onRestart}
                  className="w-full bg-white text-current font-bold py-4 rounded-2xl text-xl shadow-lg hover:scale-105 transition-transform"
                  data-testid="button-play-again"
                >
                  再玩一次
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Score Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md border-4 border-[hsl(var(--macaron-purple))] rounded-3xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-center text-[hsl(var(--macaron-purple-dark))]">
              新紀錄！
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="text-center text-lg text-muted-foreground">
              你得了 <span className="font-bold text-[hsl(var(--macaron-purple))] text-2xl">{score}</span> 分！
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">你的名字</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="輸入你的名字..."
                className="text-lg py-6 rounded-xl border-2 border-gray-200 focus-visible:ring-[hsl(var(--macaron-purple))]"
                autoFocus
                data-testid="input-player-name"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleSaveScore}
              disabled={!playerName.trim() || isSubmitting}
              className="w-full btn-macaron btn-purple text-lg py-6 rounded-xl"
              data-testid="button-save-score"
            >
              {isSubmitting ? "儲存中..." : "儲存分數"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
