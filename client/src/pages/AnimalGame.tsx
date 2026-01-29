import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SpeakableOption } from "@/components/SpeakableOption";
import { useTTS } from "@/hooks/use-tts";

const ANIMALS = [
  { id: "dog", emoji: "🐕", name: "狗", sound: "汪汪", habitat: "家裡" },
  { id: "cat", emoji: "🐈", name: "貓", sound: "喵喵", habitat: "家裡" },
  { id: "cow", emoji: "🐄", name: "牛", sound: "哞哞", habitat: "農場" },
  { id: "pig", emoji: "🐷", name: "豬", sound: "呼嚕呼嚕", habitat: "農場" },
  { id: "chicken", emoji: "🐔", name: "雞", sound: "咕咕咕", habitat: "農場" },
  { id: "duck", emoji: "🦆", name: "鴨", sound: "呱呱呱", habitat: "農場" },
  { id: "lion", emoji: "🦁", name: "獅子", sound: "吼吼", habitat: "草原" },
  { id: "elephant", emoji: "🐘", name: "大象", sound: "噗噗", habitat: "草原" },
  { id: "monkey", emoji: "🐵", name: "猴子", sound: "吱吱", habitat: "森林" },
  { id: "bird", emoji: "🐦", name: "小鳥", sound: "啾啾", habitat: "天空" },
  { id: "fish", emoji: "🐟", name: "魚", sound: "咕嚕咕嚕", habitat: "海洋" },
  { id: "rabbit", emoji: "🐰", name: "兔子", sound: "吱吱", habitat: "草地" },
];

type QuestionType = "name" | "sound" | "habitat";

export default function AnimalGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>("name");
  const { speak } = useTTS();

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const types: QuestionType[] = ["name", "sound", "habitat"];
    const nextType = types[questionIndex % 3];
    setQuestionType(nextType);

    const nextTarget = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setTargetAnimal(nextTarget);

    const distractors = ANIMALS.filter(a => a.id !== nextTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const roundOptions = [nextTarget, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleAnswer = (selectedId: string) => {
    if (selectedId === targetAnimal.id) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FFD93D', '#6BCB77', '#4D96FF']
      });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const playSound = () => {
    speak(`${targetAnimal.name}的叫聲是${targetAnimal.sound}`);
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
        return "這是什麼動物？";
      case "sound":
        return `哪個動物會發出「${targetAnimal.sound}」的聲音？`;
      case "habitat":
        return `哪個動物住在${targetAnimal.habitat}？`;
    }
  };

  const getOptionText = (animal: typeof ANIMALS[0]) => {
    return `${animal.emoji} ${animal.name}`;
  };

  return (
    <Layout>
      <GameShell
        title="動物王國"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="animal"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-yellow))] text-[hsl(var(--macaron-yellow-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          {questionType === "name" && (
            <motion.div
              animate={{ 
                scale: [0.9, 1.1, 1],
                rotate: shake ? [-5, 5, -5, 5, 0] : 0 
              }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-[6rem] sm:text-[8rem] md:text-[10rem] cursor-pointer"
              onClick={playSound}
              data-testid="animal-emoji"
            >
              {targetAnimal.emoji}
            </motion.div>
          )}

          {questionType === "sound" && (
            <motion.div
              animate={{ scale: [0.9, 1.1, 1] }}
              className="bg-white/50 p-6 md:p-8 rounded-3xl"
            >
              <div className="text-4xl md:text-6xl font-bold text-center">
                「{targetAnimal.sound}」
              </div>
            </motion.div>
          )}

          {questionType === "habitat" && (
            <motion.div
              animate={{ scale: [0.9, 1.1, 1] }}
              className="bg-white/50 p-6 md:p-8 rounded-3xl"
            >
              <div className="text-3xl md:text-5xl font-bold text-center">
                🏠 {targetAnimal.habitat}
              </div>
            </motion.div>
          )}

          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
            {getQuestion()}
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-lg px-2">
            {options.map((option, idx) => (
              <SpeakableOption
                key={option.id + idx}
                speakText={option.name}
                onSelect={() => handleAnswer(option.id)}
                className="btn-macaron bg-white text-lg sm:text-xl md:text-2xl py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl text-[hsl(var(--macaron-yellow-dark))] hover:bg-white/90"
                data-testid={`button-animal-${option.id}`}
              >
                {getOptionText(option)}
              </SpeakableOption>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
