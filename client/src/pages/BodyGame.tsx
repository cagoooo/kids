import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SpeakableOption } from "@/components/SpeakableOption";

const BODY_PARTS = [
  { id: "head", name: "頭", function: "思考", emoji: "🧠" },
  { id: "eye", name: "眼睛", function: "看東西", emoji: "👁️" },
  { id: "ear", name: "耳朵", function: "聽聲音", emoji: "👂" },
  { id: "nose", name: "鼻子", function: "聞味道", emoji: "👃" },
  { id: "mouth", name: "嘴巴", function: "吃東西和說話", emoji: "👄" },
  { id: "hand", name: "手", function: "拿東西", emoji: "✋" },
  { id: "foot", name: "腳", function: "走路", emoji: "🦶" },
  { id: "heart", name: "心臟", function: "讓血液流動", emoji: "❤️" },
];

const HEALTH_HABITS = [
  { question: "早上起床後要做什麼？", correct: "刷牙洗臉", wrong: ["吃糖果", "看電視", "繼續睡"] },
  { question: "吃飯前要做什麼？", correct: "洗手", wrong: ["玩手機", "跑步", "畫畫"] },
  { question: "運動後要做什麼？", correct: "喝水休息", wrong: ["吃冰淇淋", "繼續跑", "不用管"] },
  { question: "晚上幾點該睡覺？", correct: "九點左右", wrong: ["十二點", "不用睡", "凌晨"] },
  { question: "保護眼睛要怎麼做？", correct: "少看螢幕多休息", wrong: ["一直看電視", "在黑暗中看書", "不眨眼睛"] },
];

type QuestionType = "part" | "function" | "habit";

export default function BodyGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetPart, setTargetPart] = useState(BODY_PARTS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>("part");
  const [currentHabit, setCurrentHabit] = useState(HEALTH_HABITS[0]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    if (questionIndex < 4) {
      setQuestionType("part");
      const nextTarget = BODY_PARTS[questionIndex % BODY_PARTS.length];
      setTargetPart(nextTarget);
      const distractors = BODY_PARTS.filter(p => p.id !== nextTarget.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    } else if (questionIndex < 7) {
      setQuestionType("function");
      const nextTarget = BODY_PARTS[(questionIndex - 4) % BODY_PARTS.length];
      setTargetPart(nextTarget);
      const distractors = BODY_PARTS.filter(p => p.id !== nextTarget.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    } else {
      setQuestionType("habit");
      const habit = HEALTH_HABITS[(questionIndex - 7) % HEALTH_HABITS.length];
      setCurrentHabit(habit);
      const allOptions = [habit.correct, ...habit.wrong].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
      setCorrectAnswer(habit.correct);
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
        colors: ['#FF99CC', '#6BCB77', '#4D96FF']
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
      case "part":
        return "這是身體的哪個部位？";
      case "function":
        return `哪個部位可以「${targetPart.function}」？`;
      case "habit":
        return currentHabit.question;
    }
  };

  return (
    <Layout>
      <GameShell
        title="我的身體"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="body"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-pink))] text-[hsl(var(--macaron-pink-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          {questionType === "part" && (
            <motion.div
              animate={{ 
                scale: [0.9, 1.1, 1],
                rotate: shake ? [-5, 5, -5, 5, 0] : 0 
              }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-[6rem] sm:text-[8rem] md:text-[10rem]"
            >
              {targetPart.emoji}
            </motion.div>
          )}

          {questionType === "function" && (
            <motion.div
              animate={{ scale: [0.9, 1.1, 1] }}
              className="bg-white/50 p-6 md:p-8 rounded-3xl"
            >
              <div className="text-3xl md:text-5xl font-bold text-center">
                「{targetPart.function}」
              </div>
            </motion.div>
          )}

          {questionType === "habit" && (
            <motion.div
              animate={{ scale: [0.9, 1.1, 1] }}
              className="bg-white/50 p-6 md:p-8 rounded-3xl flex items-center gap-4"
            >
              <span className="text-5xl md:text-6xl">💪</span>
            </motion.div>
          )}

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center px-4">
            {getQuestion()}
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-lg px-2">
            {options.map((option, idx) => (
              <SpeakableOption
                key={option + idx}
                speakText={option}
                onSelect={() => handleAnswer(option)}
                className="btn-macaron bg-white text-lg sm:text-xl md:text-2xl py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-pink-dark))] hover:bg-white/90"
                data-testid={`button-body-${idx}`}
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
