import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

// Game Data - Traditional Chinese color names
const COLORS = [
  { name: "紅色", hex: "#FF6B6B", id: "red" },
  { name: "藍色", hex: "#4D96FF", id: "blue" },
  { name: "綠色", hex: "#6BCB77", id: "green" },
  { name: "黃色", hex: "#FFD93D", id: "yellow" },
  { name: "紫色", hex: "#9D4EDD", id: "purple" },
  { name: "橘色", hex: "#FF9F45", id: "orange" },
  { name: "粉紅色", hex: "#FF99CC", id: "pink" },
  { name: "棕色", hex: "#8D6E63", id: "brown" },
];

export default function ColorGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  // Setup round
  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const nextTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(nextTarget);

    // Generate 3 distractors unique from target
    const distractors = COLORS.filter(c => c.id !== nextTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle
    const roundOptions = [nextTarget, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleAnswer = (selectedId: string) => {
    if (selectedId === targetColor.id) {
      // Correct
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: [targetColor.hex]
      });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 500);
    } else {
      // Wrong
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

  return (
    <Layout>
      <GameShell
        title="顏色配對"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="color"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-pink))] text-[hsl(var(--macaron-pink-dark))]"
      >
        <div className="flex flex-col items-center gap-12">
          {/* Question: The Color Swatch */}
          <motion.div
            animate={{ 
              scale: [0.9, 1.1, 1],
              rotate: shake ? [-5, 5, -5, 5, 0] : 0 
            }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] shadow-2xl border-8 border-white"
            style={{ backgroundColor: targetColor.hex }}
          />

          <h3 className="font-display text-3xl font-bold text-center">
            這是什麼顏色？
          </h3>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            {options.map((option, idx) => (
              <motion.button
                key={option.id + idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option.id)}
                className="btn-macaron bg-white text-2xl py-6 rounded-2xl text-[hsl(var(--macaron-pink-dark))] hover:bg-white/90"
                data-testid={`button-color-${option.id}`}
              >
                {option.name}
              </motion.button>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
