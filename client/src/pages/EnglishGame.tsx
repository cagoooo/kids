import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const WORDS = [
  { word: "Apple", emoji: "🍎" },
  { word: "Dog", emoji: "🐶" },
  { word: "Cat", emoji: "🐱" },
  { word: "Car", emoji: "🚗" },
  { word: "Ball", emoji: "⚽" },
  { word: "Sun", emoji: "☀️" },
  { word: "Book", emoji: "📚" },
  { word: "Fish", emoji: "🐠" },
  { word: "Tree", emoji: "🌳" },
  { word: "House", emoji: "🏠" },
  { word: "Star", emoji: "⭐" },
  { word: "Moon", emoji: "🌙" },
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
        title="Word Match"
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
              <span className="font-display text-5xl font-bold">{target.word}</span>
            )}
          </motion.div>

          <h3 className="font-display text-3xl font-bold opacity-90">
            {mode === "emoji-to-word" ? "What is this?" : "Pick the picture!"}
          </h3>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            {options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt.word)}
                className="btn-macaron bg-white py-6 rounded-2xl text-[hsl(var(--macaron-green-dark))] hover:bg-white/90"
              >
                {mode === "emoji-to-word" ? (
                  <span className="text-3xl font-bold font-display">{opt.word}</span>
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
