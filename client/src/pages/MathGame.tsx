import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Apple } from "lucide-react";
import { SpeakableOption } from "@/components/SpeakableOption";
import { generateMathProblem } from "@/utils/math-logic";

export default function MathGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', ans: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);

  // ...

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const newProblem = generateMathProblem();
    setProblem({
      a: newProblem.a,
      b: newProblem.b,
      op: newProblem.op,
      ans: newProblem.ans
    });
    setOptions(newProblem.options);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleAnswer = (val: number) => {
    if (val === problem.ans) {
      confetti({ particleCount: 30, spread: 50, colors: ['#4D96FF'] });
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
        title="數學樂園"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="math"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-blue))] text-[hsl(var(--macaron-blue-dark))]"
      >
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">

          {/* Visual Aid for Addition */}
          {problem.op === '+' && problem.a + problem.b <= 10 && (
            <div className="flex gap-4 sm:gap-6 md:gap-8 items-center bg-white/30 p-3 sm:p-4 rounded-2xl md:rounded-3xl">
              <div className="flex gap-0.5 sm:gap-1 flex-wrap justify-center max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
                {Array.from({ length: problem.a }).map((_, i) => (
                  <Apple key={`a-${i}`} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-red-400 text-red-600" />
                ))}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black">+</div>
              <div className="flex gap-0.5 sm:gap-1 flex-wrap justify-center max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
                {Array.from({ length: problem.b }).map((_, i) => (
                  <Apple key={`b-${i}`} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-red-400 text-red-600" />
                ))}
              </div>
            </div>
          )}

          {/* Question Display */}
          <motion.div
            animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
            className="bg-white/80 backdrop-blur-md px-6 py-4 sm:px-8 sm:py-6 md:px-12 md:py-8 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-lg border-b-4 md:border-b-8 border-black/5"
          >
            <span className="font-display text-4xl sm:text-5xl md:text-7xl font-black tracking-wider text-[hsl(var(--macaron-blue-dark))]">
              {problem.a} {problem.op} {problem.b} = ?
            </span>
          </motion.div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-lg mt-4 sm:mt-6 px-2">
            {options.map((opt, idx) => (
              <SpeakableOption
                key={idx}
                speakText={String(opt)}
                onSelect={() => handleAnswer(opt)}
                className="btn-macaron bg-white text-2xl sm:text-3xl md:text-4xl py-4 sm:py-6 md:py-8 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-blue-dark))] hover:bg-white/90"
                data-testid={`button-math-${opt}`}
              >
                {opt}
              </SpeakableOption>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
