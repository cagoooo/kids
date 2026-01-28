import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const WORDS = [
  { word: "Apple", chinese: "蘋果", emoji: "🍎" },
  { word: "Dog", chinese: "狗", emoji: "🐶" },
  { word: "Cat", chinese: "貓", emoji: "🐱" },
  { word: "Car", chinese: "汽車", emoji: "🚗" },
  { word: "Ball", chinese: "球", emoji: "⚽" },
  { word: "Sun", chinese: "太陽", emoji: "☀️" },
  { word: "Book", chinese: "書", emoji: "📚" },
  { word: "Fish", chinese: "魚", emoji: "🐠" },
  { word: "Tree", chinese: "樹", emoji: "🌳" },
  { word: "House", chinese: "房子", emoji: "🏠" },
  { word: "Star", chinese: "星星", emoji: "⭐" },
  { word: "Moon", chinese: "月亮", emoji: "🌙" },
];

export default function EnglishGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(WORDS[0]);
  const [options, setOptions] = useState<typeof WORDS>([]);
  const [mode, setMode] = useState<"emoji-to-word" | "word-to-emoji">("emoji-to-word");
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const nextTarget = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTarget(nextTarget);
    setMode(Math.random() > 0.5 ? "emoji-to-word" : "word-to-emoji");

    const distractors = WORDS.filter(w => w.word !== nextTarget.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setOptions([nextTarget, ...distractors].sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleAnswer = (word: string) => {
    if (word === target.word) {
      confetti({ particleCount: 30, spread: 50, colors: ['#6BCB77'] });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 500);
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

  return (
    <Layout>
      <GameShell
        title="單字配對"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="english"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <div className="flex flex-col items-center gap-10">
          
          <motion.div
            animate={{ rotate: shake ? [-5, 5, -5, 5, 0] : 0 }}
            className="bg-white/80 backdrop-blur-md p-10 rounded-full shadow-lg w-56 h-56 flex items-center justify-center border-8 border-white"
          >
            {mode === "emoji-to-word" ? (
              <span className="text-9xl filter drop-shadow-md">{target.emoji}</span>
            ) : (
              <div className="text-center">
                <span className="font-display text-4xl font-bold block">{target.word}</span>
                <span className="text-2xl text-muted-foreground">({target.chinese})</span>
              </div>
            )}
          </motion.div>

          <h3 className="font-display text-3xl font-bold opacity-90">
            {mode === "emoji-to-word" ? "這是什麼？" : "選出正確的圖案！"}
          </h3>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            {options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt.word)}
                className="btn-macaron bg-white py-6 rounded-2xl text-[hsl(var(--macaron-green-dark))] hover:bg-white/90"
                data-testid={`button-english-${opt.word.toLowerCase()}`}
              >
                {mode === "emoji-to-word" ? (
                  <div className="text-center">
                    <span className="text-2xl font-bold font-display block">{opt.word}</span>
                    <span className="text-lg text-muted-foreground">({opt.chinese})</span>
                  </div>
                ) : (
                  <span className="text-6xl">{opt.emoji}</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
