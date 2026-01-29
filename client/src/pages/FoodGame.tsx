import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SpeakableOption } from "@/components/SpeakableOption";

const FOODS = [
  { id: "apple", emoji: "🍎", name: "蘋果", type: "水果", color: "紅色" },
  { id: "banana", emoji: "🍌", name: "香蕉", type: "水果", color: "黃色" },
  { id: "grape", emoji: "🍇", name: "葡萄", type: "水果", color: "紫色" },
  { id: "orange", emoji: "🍊", name: "橘子", type: "水果", color: "橘色" },
  { id: "watermelon", emoji: "🍉", name: "西瓜", type: "水果", color: "綠色" },
  { id: "strawberry", emoji: "🍓", name: "草莓", type: "水果", color: "紅色" },
  { id: "carrot", emoji: "🥕", name: "紅蘿蔔", type: "蔬菜", color: "橘色" },
  { id: "broccoli", emoji: "🥦", name: "花椰菜", type: "蔬菜", color: "綠色" },
  { id: "corn", emoji: "🌽", name: "玉米", type: "蔬菜", color: "黃色" },
  { id: "tomato", emoji: "🍅", name: "番茄", type: "蔬菜", color: "紅色" },
  { id: "eggplant", emoji: "🍆", name: "茄子", type: "蔬菜", color: "紫色" },
  { id: "cucumber", emoji: "🥒", name: "小黃瓜", type: "蔬菜", color: "綠色" },
];

type QuestionType = "name" | "type" | "color";

export default function FoodGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetFood, setTargetFood] = useState(FOODS[0]);
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

    const types: QuestionType[] = ["name", "name", "type", "type", "name", "color", "name", "type", "color", "name"];
    const nextType = types[questionIndex];
    setQuestionType(nextType);

    const nextTarget = FOODS[Math.floor(Math.random() * FOODS.length)];
    setTargetFood(nextTarget);

    if (nextType === "name") {
      const distractors = FOODS.filter(f => f.id !== nextTarget.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const roundOptions = [nextTarget.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.name);
    } else if (nextType === "type") {
      const roundOptions = ["水果", "蔬菜"];
      setOptions(roundOptions);
      setCorrectAnswer(nextTarget.type);
    } else {
      const colors = Array.from(new Set(FOODS.map(f => f.color))).sort(() => 0.5 - Math.random()).slice(0, 4);
      if (!colors.includes(nextTarget.color)) {
        colors[0] = nextTarget.color;
      }
      setOptions(colors.sort(() => 0.5 - Math.random()));
      setCorrectAnswer(nextTarget.color);
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
        colors: ['#6BCB77', '#FFD93D', '#FF6B6B']
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
        return "這是什麼？";
      case "type":
        return `${targetFood.emoji} ${targetFood.name} 是水果還是蔬菜？`;
      case "color":
        return `${targetFood.emoji} ${targetFood.name} 是什麼顏色？`;
    }
  };

  return (
    <Layout>
      <GameShell
        title="蔬果大集合"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="food"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <motion.div
            animate={{ 
              scale: [0.9, 1.1, 1],
              rotate: shake ? [-5, 5, -5, 5, 0] : 0 
            }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-[6rem] sm:text-[8rem] md:text-[10rem]"
          >
            {targetFood.emoji}
          </motion.div>

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
            {getQuestion()}
          </h3>

          <div className={`grid gap-4 sm:gap-5 md:gap-6 w-full max-w-lg px-2 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {options.map((option, idx) => (
              <SpeakableOption
                key={option + idx}
                speakText={option}
                onSelect={() => handleAnswer(option)}
                className="btn-macaron bg-white text-lg sm:text-xl md:text-2xl py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-green-dark))] hover:bg-white/90"
                data-testid={`button-food-${idx}`}
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
