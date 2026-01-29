import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SpeakableOption } from "@/components/SpeakableOption";

const JOBS = [
  { id: "doctor", emoji: "👨‍⚕️", name: "醫生", tool: "聽診器", action: "治療病人" },
  { id: "firefighter", emoji: "👨‍🚒", name: "消防員", tool: "滅火器", action: "滅火救人" },
  { id: "police", emoji: "👮", name: "警察", tool: "對講機", action: "保護大家" },
  { id: "teacher", emoji: "👩‍🏫", name: "老師", tool: "粉筆", action: "教導學生" },
  { id: "chef", emoji: "👨‍🍳", name: "廚師", tool: "鍋子", action: "做好吃的料理" },
  { id: "farmer", emoji: "👨‍🌾", name: "農夫", tool: "鋤頭", action: "種田種菜" },
  { id: "pilot", emoji: "👨‍✈️", name: "飛行員", tool: "飛機", action: "駕駛飛機" },
  { id: "astronaut", emoji: "👨‍🚀", name: "太空人", tool: "太空衣", action: "探索太空" },
  { id: "artist", emoji: "👨‍🎨", name: "畫家", tool: "畫筆", action: "畫畫" },
  { id: "scientist", emoji: "👨‍🔬", name: "科學家", tool: "實驗器材", action: "做實驗" },
];

type QuestionType = "name" | "action" | "tool";

export default function JobGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetJob, setTargetJob] = useState(JOBS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>("name");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const types: QuestionType[] = ["name", "action", "name", "tool", "name", "action", "name", "tool", "action", "name"];
    const nextType = types[questionIndex];
    setQuestionType(nextType);

    const nextTarget = JOBS[Math.floor(Math.random() * JOBS.length)];
    setTargetJob(nextTarget);

    const distractors = JOBS.filter(j => j.id !== nextTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (nextType === "name") {
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    } else if (nextType === "action") {
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    } else {
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    }
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleAnswer = (selected: string) => {
    if (selected === correctAnswer) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#9D4EDD', '#4D96FF', '#FFD93D']
      });
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

  const getQuestion = () => {
    switch (questionType) {
      case "name":
        return "這是什麼職業？";
      case "action":
        return `誰會「${targetJob.action}」？`;
      case "tool":
        return `誰會用「${targetJob.tool}」？`;
    }
  };

  return (
    <Layout>
      <GameShell
        title="職業大冒險"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="job"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          {questionType === "name" && (
            <motion.div
              animate={{ 
                scale: [0.9, 1.1, 1],
                rotate: shake ? [-5, 5, -5, 5, 0] : 0 
              }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-[6rem] sm:text-[8rem] md:text-[10rem]"
            >
              {targetJob.emoji}
            </motion.div>
          )}

          {questionType === "action" && (
            <motion.div
              animate={{ scale: [0.9, 1.1, 1] }}
              className="bg-white/50 p-6 md:p-8 rounded-3xl"
            >
              <div className="text-3xl md:text-5xl font-bold text-center">
                「{targetJob.action}」
              </div>
            </motion.div>
          )}

          {questionType === "tool" && (
            <motion.div
              animate={{ scale: [0.9, 1.1, 1] }}
              className="bg-white/50 p-6 md:p-8 rounded-3xl"
            >
              <div className="text-3xl md:text-5xl font-bold text-center">
                🔧 {targetJob.tool}
              </div>
            </motion.div>
          )}

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
            {getQuestion()}
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-lg px-2">
            {options.map((option, idx) => (
              <SpeakableOption
                key={option + idx}
                speakText={option}
                onSelect={() => handleAnswer(option)}
                className="btn-macaron bg-white text-lg sm:text-xl md:text-2xl py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-purple-dark))] hover:bg-white/90"
                data-testid={`button-job-${idx}`}
              >
                {option}
              </SpeakableOption>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
