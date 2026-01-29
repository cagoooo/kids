import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const DIFFERENCE_SETS = [
  { base: ["🍎", "🍎", "🍎", "🍎"], different: { idx: 2, emoji: "🍊" }, hint: "找出不一樣的水果" },
  { base: ["🐱", "🐱", "🐱", "🐱"], different: { idx: 1, emoji: "🐶" }, hint: "找出不一樣的動物" },
  { base: ["⭐", "⭐", "⭐", "⭐"], different: { idx: 3, emoji: "🌙" }, hint: "找出不一樣的形狀" },
  { base: ["🚗", "🚗", "🚗", "🚗"], different: { idx: 0, emoji: "🚌" }, hint: "找出不一樣的車" },
  { base: ["🌸", "🌸", "🌸", "🌸"], different: { idx: 2, emoji: "🌻" }, hint: "找出不一樣的花" },
  { base: ["🔵", "🔵", "🔵", "🔵"], different: { idx: 1, emoji: "🔴" }, hint: "找出不一樣的顏色" },
  { base: ["🎈", "🎈", "🎈", "🎈"], different: { idx: 0, emoji: "🎁" }, hint: "找出不一樣的東西" },
  { base: ["🐦", "🐦", "🐦", "🐦"], different: { idx: 3, emoji: "🦋" }, hint: "找出不會唱歌的" },
  { base: ["🍕", "🍕", "🍕", "🍕"], different: { idx: 1, emoji: "🍔" }, hint: "找出不一樣的食物" },
  { base: ["👟", "👟", "👟", "👟"], different: { idx: 2, emoji: "🧦" }, hint: "找出不是鞋子的" },
];

const HARD_SETS = [
  { items: ["😀", "😀", "😃", "😀", "😀", "😀"], differentIdx: 2, hint: "找出不一樣的表情" },
  { items: ["🐸", "🐸", "🐸", "🐢", "🐸", "🐸"], differentIdx: 3, hint: "找出不一樣的動物" },
  { items: ["🌳", "🌳", "🌲", "🌳", "🌳", "🌳"], differentIdx: 2, hint: "找出不一樣的樹" },
  { items: ["🔴", "🔴", "🔴", "🔴", "🟠", "🔴"], differentIdx: 4, hint: "找出不一樣的顏色" },
  { items: ["📚", "📚", "📚", "📕", "📚", "📚"], differentIdx: 3, hint: "找出不一樣的書" },
];

export default function DifferenceGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentSet, setCurrentSet] = useState<{ items: string[]; differentIdx: number; hint: string } | null>(null);
  const [found, setFound] = useState(false);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    setFound(false);

    if (questionIndex < 5) {
      const set = DIFFERENCE_SETS[questionIndex % DIFFERENCE_SETS.length];
      const items = [...set.base];
      items[set.different.idx] = set.different.emoji;
      setCurrentSet({
        items,
        differentIdx: set.different.idx,
        hint: set.hint
      });
    } else {
      const set = HARD_SETS[(questionIndex - 5) % HARD_SETS.length];
      setCurrentSet({
        items: set.items,
        differentIdx: set.differentIdx,
        hint: set.hint
      });
    }
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleClick = (idx: number) => {
    if (found || !currentSet) return;

    if (idx === currentSet.differentIdx) {
      setFound(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD93D', '#6BCB77', '#4D96FF']
      });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 800);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
    setupRound();
  };

  if (!currentSet) return null;

  return (
    <Layout>
      <GameShell
        title="找找看"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="difference"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-blue))] text-[hsl(var(--macaron-blue-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <motion.h3 
            animate={{ rotate: shake ? [-3, 3, -3, 3, 0] : 0 }}
            className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center"
          >
            {currentSet.hint}
          </motion.h3>

          <div className={`grid gap-4 md:gap-6 ${currentSet.items.length > 4 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {currentSet.items.map((emoji, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleClick(idx)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={found && idx === currentSet.differentIdx ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer transition-all ${
                  found && idx === currentSet.differentIdx ? 'ring-4 ring-green-400 bg-green-50' : 'hover:bg-gray-50'
                }`}
                data-testid={`difference-item-${idx}`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>

          <p className="text-sm md:text-base text-center opacity-70">
            點擊不一樣的那一個！
          </p>
        </div>
      </GameShell>
    </Layout>
  );
}
