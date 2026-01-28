import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SpeakableOption } from "@/components/SpeakableOption";

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
        <div className="flex flex-col items-center gap-6 md:gap-12">
          {/* Question: The Color Swatch */}
          <motion.div
            animate={{ 
              scale: [0.9, 1.1, 1],
              rotate: shake ? [-5, 5, -5, 5, 0] : 0 
            }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 md:border-8 border-white"
            style={{ backgroundColor: targetColor.hex }}
          />

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
            這是什麼顏色？
          </h3>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-lg px-2 mt-2">
            {options.map((option, idx) => (
              <SpeakableOption
                key={option.id + idx}
                speakText={option.name}
                onSelect={() => handleAnswer(option.id)}
                className="btn-macaron bg-white text-lg sm:text-xl md:text-2xl py-3 sm:py-4 md:py-6 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-pink-dark))] hover:bg-white/90"
                data-testid={`button-color-${option.id}`}
              >
                {option.name}
              </SpeakableOption>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
