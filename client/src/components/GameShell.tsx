import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Star, Gift } from "lucide-react";
import { Link } from "wouter";
import { useAddScore } from "@/hooks/use-scores";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STICKERS = [
  { id: 1, emoji: "🦄", name: "獨角獸", rarity: "稀有" },
  { id: 2, emoji: "🐱", name: "小貓咪", rarity: "普通" },
  { id: 3, emoji: "🐶", name: "小狗狗", rarity: "普通" },
  { id: 4, emoji: "🐰", name: "小兔子", rarity: "普通" },
  { id: 5, emoji: "🦋", name: "蝴蝶", rarity: "稀有" },
  { id: 6, emoji: "🌈", name: "彩虹", rarity: "稀有" },
  { id: 7, emoji: "⭐", name: "星星", rarity: "普通" },
  { id: 8, emoji: "🌸", name: "櫻花", rarity: "普通" },
  { id: 9, emoji: "🍰", name: "蛋糕", rarity: "普通" },
  { id: 10, emoji: "🍭", name: "棒棒糖", rarity: "普通" },
  { id: 11, emoji: "🎀", name: "蝴蝶結", rarity: "普通" },
  { id: 12, emoji: "🎈", name: "氣球", rarity: "普通" },
  { id: 13, emoji: "🦊", name: "小狐狸", rarity: "稀有" },
  { id: 14, emoji: "🐼", name: "熊貓", rarity: "稀有" },
  { id: 15, emoji: "🦁", name: "獅子", rarity: "稀有" },
  { id: 16, emoji: "🐧", name: "企鵝", rarity: "普通" },
  { id: 17, emoji: "🦀", name: "螃蟹", rarity: "普通" },
  { id: 18, emoji: "🐳", name: "鯨魚", rarity: "稀有" },
  { id: 19, emoji: "🌟", name: "閃亮星", rarity: "傳說" },
  { id: 20, emoji: "👑", name: "皇冠", rarity: "傳說" },
];

const STICKER_STORAGE_KEY = "kidszone_stickers";

type GameType = "color" | "math" | "english" | "shape" | "melody" | "clock" | "bopomofo" | "emotion" | "coding" | "garden" | "market" | "recycle" | "memory" | "animal" | "traffic" | "body" | "food" | "job" | "puzzle" | "difference" | "sequence" | "sorting";

interface GameShellProps {
  title: string;
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  gameType: GameType;
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
  const [earnedSticker, setEarnedSticker] = useState<typeof STICKERS[0] | null>(null);
  const addScore = useAddScore();

  const awardSticker = () => {
    const saved = localStorage.getItem(STICKER_STORAGE_KEY);
    const collected: number[] = saved ? JSON.parse(saved) : [];

    const uncollected = STICKERS.filter(s => !collected.includes(s.id));

    if (uncollected.length === 0) {
      const randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
      setEarnedSticker(randomSticker);
      return;
    }

    const weights = uncollected.map(s => {
      if (s.rarity === "傳說") return 1;
      if (s.rarity === "稀有") return 3;
      return 10;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    let selectedSticker = uncollected[0];
    for (let i = 0; i < uncollected.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedSticker = uncollected[i];
        break;
      }
    }

    collected.push(selectedSticker.id);
    localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(collected));
    setEarnedSticker(selectedSticker);
  };

  useEffect(() => {
    if (isGameOver) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC0CB', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C']
      });

      if (score >= 50) {
        awardSticker();
      }

      const timer = setTimeout(() => setShowSaveDialog(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isGameOver]);

  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);

  const handleSaveScore = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    try {
      await addScore.mutateAsync({
        playerName,
        gameType,
        score
      });
      setSavedScore(score);
      setScoreSaved(true);
      setShowSaveDialog(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    setSavedScore(null);
    setScoreSaved(false);
    setEarnedSticker(null);
    setPlayerName("");
    onRestart();
  };

  const handleClose = () => {
    setShowSaveDialog(false);
    setEarnedSticker(null);
  };

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className={`min-h-[80vh] flex flex-col ${colorClass} rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-xl relative overflow-hidden border-4 md:border-8 border-white`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Star className="w-64 h-64 fill-current" />
      </div>

      {/* Game Header */}
      <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
        <Link href={base + "/"}>
          <button
            className="bg-white/40 hover:bg-white/60 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95 text-inherit"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 stroke-[3]" />
          </button>
        </Link>

        <div className="flex flex-col items-center">
          <h2 className="font-display text-xl md:text-3xl font-bold text-shadow">{title}</h2>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${i < currentQuestionIndex ? "bg-white" : "bg-black/10"
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/40 px-4 md:px-6 py-2 rounded-xl md:rounded-2xl font-display font-bold text-xl md:text-2xl flex items-center gap-2">
          <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-500" />
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
              <h1 className="font-display text-5xl md:text-6xl font-black text-white text-shadow-lg">
                太棒了！
              </h1>
              <div className="bg-white/30 backdrop-blur-md p-6 md:p-8 rounded-3xl w-full max-w-md">
                <p className="text-xl md:text-2xl font-bold mb-2">最終得分</p>
                <div className="text-6xl md:text-8xl font-black text-white text-shadow-lg mb-4">
                  {savedScore !== null ? savedScore : score}
                </div>

                {earnedSticker && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="bg-white/50 p-4 rounded-2xl mb-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Gift className="w-5 h-5" />
                      <span className="font-bold">獲得貼紙！</span>
                    </div>
                    <div className="text-6xl">{earnedSticker.emoji}</div>
                    <div className="text-sm font-medium mt-1">{earnedSticker.name}</div>
                  </motion.div>
                )}

                {scoreSaved && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl mb-4 font-bold">
                    分數已儲存！
                  </div>
                )}

                <button
                  onClick={handlePlayAgain}
                  className="w-full bg-white text-current font-bold py-3 md:py-4 rounded-2xl text-lg md:text-xl shadow-lg hover:scale-105 transition-transform"
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
      <Dialog open={showSaveDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md border-4 border-[hsl(var(--macaron-purple))] rounded-3xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-center text-[hsl(var(--macaron-purple-dark))]">
              {earnedSticker ? "恭喜你！" : "新紀錄！"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="text-center text-lg text-muted-foreground">
              你得了 <span className="font-bold text-[hsl(var(--macaron-purple))] text-2xl">{score}</span> 分！
            </div>

            {earnedSticker && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center bg-gradient-to-br from-yellow-100 to-pink-100 p-4 rounded-2xl"
              >
                <div className="text-5xl mb-2">{earnedSticker.emoji}</div>
                <div className="font-bold">獲得「{earnedSticker.name}」貼紙！</div>
                <div className="text-sm text-muted-foreground">
                  {earnedSticker.rarity === "傳說" && "✨ 傳說級貼紙！"}
                  {earnedSticker.rarity === "稀有" && "💎 稀有貼紙！"}
                </div>
              </motion.div>
            )}

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
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl"
            >
              稍後再說
            </Button>
            <Button
              onClick={handleSaveScore}
              disabled={!playerName.trim() || isSubmitting}
              className="flex-1 btn-macaron btn-purple text-lg py-6 rounded-xl"
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
