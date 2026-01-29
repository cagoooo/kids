import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SpeakableOption } from "@/components/SpeakableOption";

const VEHICLES = [
  { id: "car", emoji: "🚗", name: "汽車", where: "馬路" },
  { id: "bus", emoji: "🚌", name: "公車", where: "馬路" },
  { id: "taxi", emoji: "🚕", name: "計程車", where: "馬路" },
  { id: "truck", emoji: "🚚", name: "卡車", where: "馬路" },
  { id: "motorcycle", emoji: "🏍️", name: "摩托車", where: "馬路" },
  { id: "bicycle", emoji: "🚲", name: "腳踏車", where: "腳踏車道" },
  { id: "train", emoji: "🚃", name: "火車", where: "鐵軌" },
  { id: "airplane", emoji: "✈️", name: "飛機", where: "天空" },
  { id: "ship", emoji: "🚢", name: "船", where: "海上" },
  { id: "helicopter", emoji: "🚁", name: "直升機", where: "天空" },
  { id: "ambulance", emoji: "🚑", name: "救護車", where: "馬路" },
  { id: "firetruck", emoji: "🚒", name: "消防車", where: "馬路" },
];

const TRAFFIC_RULES = [
  { question: "紅燈亮了，我們應該？", correct: "停下來等待", wrong: ["繼續走", "跑步過去", "往後退"] },
  { question: "綠燈亮了，我們可以？", correct: "小心通過", wrong: ["繼續等待", "閉眼走", "不看車就走"] },
  { question: "過馬路時要？", correct: "左看右看", wrong: ["閉著眼睛", "邊跑邊過", "不用看車"] },
  { question: "在人行道上應該？", correct: "慢慢走", wrong: ["跑來跑去", "騎腳踏車", "玩滑板"] },
  { question: "看到救護車來了，我們應該？", correct: "讓路給它先過", wrong: ["搶在它前面", "不用理它", "跟著它跑"] },
];

type QuestionType = "vehicle" | "rule";

export default function TrafficGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetVehicle, setTargetVehicle] = useState(VEHICLES[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>("vehicle");
  const [currentRule, setCurrentRule] = useState(TRAFFIC_RULES[0]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const isVehicle = questionIndex < 6;
    setQuestionType(isVehicle ? "vehicle" : "rule");

    if (isVehicle) {
      const nextTarget = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
      setTargetVehicle(nextTarget);

      const distractors = VEHICLES.filter(v => v.id !== nextTarget.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    } else {
      const rule = TRAFFIC_RULES[(questionIndex - 6) % TRAFFIC_RULES.length];
      setCurrentRule(rule);
      const allOptions = [rule.correct, ...rule.wrong].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
      setCorrectAnswer(rule.correct);
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
        colors: ['#4D96FF', '#6BCB77', '#FFD93D']
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

  return (
    <Layout>
      <GameShell
        title="交通小達人"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="traffic"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-blue))] text-[hsl(var(--macaron-blue-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          {questionType === "vehicle" ? (
            <>
              <motion.div
                animate={{ 
                  scale: [0.9, 1.1, 1],
                  rotate: shake ? [-5, 5, -5, 5, 0] : 0 
                }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-[6rem] sm:text-[8rem] md:text-[10rem]"
              >
                {targetVehicle.emoji}
              </motion.div>

              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
                這是什麼交通工具？
              </h3>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scale: [0.9, 1.1, 1] }}
                className="bg-white/50 p-6 md:p-8 rounded-3xl flex items-center gap-4"
              >
                <span className="text-5xl md:text-6xl">🚦</span>
                <span className="text-xl md:text-2xl font-bold">{currentRule.question}</span>
              </motion.div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-lg px-2">
            {options.map((option, idx) => (
              <SpeakableOption
                key={option + idx}
                speakText={option}
                onSelect={() => handleAnswer(option)}
                className="btn-macaron bg-white text-lg sm:text-xl md:text-2xl py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-blue-dark))] hover:bg-white/90"
                data-testid={`button-traffic-${idx}`}
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
