import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";
import { Droplets, Sun, Sparkles } from "lucide-react";

interface Plant {
  id: string;
  name: string;
  seed: string;
  sprout: string;
  flower: string;
}

const PLANTS: Plant[] = [
  { id: "sunflower", name: "向日葵", seed: "🌰", sprout: "🌱", flower: "🌻" },
  { id: "tulip", name: "鬱金香", seed: "🫘", sprout: "🌱", flower: "🌷" },
  { id: "rose", name: "玫瑰", seed: "🌰", sprout: "🌱", flower: "🌹" },
  { id: "cherry", name: "櫻花", seed: "🫘", sprout: "🌱", flower: "🌸" },
  { id: "hibiscus", name: "木槿花", seed: "🌰", sprout: "🌱", flower: "🌺" },
];

const STEPS = [
  { id: "seed", name: "種種子", icon: "🌰", action: "選擇種子" },
  { id: "water", name: "澆水", icon: "💧", action: "幫植物澆水" },
  { id: "sun", name: "曬太陽", icon: "☀️", action: "讓植物曬太陽" },
  { id: "fertilize", name: "施肥", icon: "✨", action: "給植物施肥" },
];

export default function GardenGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [growthStage, setGrowthStage] = useState<"empty" | "seed" | "sprout" | "flower">("empty");
  const [showFlower, setShowFlower] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  useEffect(() => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }
    const plant = PLANTS[questionIndex % PLANTS.length];
    setCurrentPlant(plant);
    setCompletedSteps([]);
    setCurrentStep(0);
    setGrowthStage("empty");
    setShowFlower(false);
    speak(`讓我們種一朵${plant.name}吧！`);
  }, [questionIndex]);

  const handleStep = (stepId: string) => {
    if (!currentPlant) return;
    
    const expectedStep = STEPS[currentStep].id;
    
    if (stepId === expectedStep) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      
      if (stepId === "seed") {
        setGrowthStage("seed");
        speak("種子種好了！");
      } else if (stepId === "water") {
        speak("澆水完成！");
      } else if (stepId === "sun") {
        setGrowthStage("sprout");
        speak("植物發芽了！");
      } else if (stepId === "fertilize") {
        speak(`哇！${currentPlant.name}開花了！`);
        setGrowthStage("flower");
        setShowFlower(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setScore(s => s + 10);
        
        setTimeout(() => {
          setQuestionIndex(i => i + 1);
        }, 2000);
      }
      
      setCurrentStep(s => s + 1);
    } else {
      speak("順序不對喔，再試試看！");
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
    setCompletedSteps([]);
    setCurrentStep(0);
    setGrowthStage("empty");
    setShowFlower(false);
  };

  return (
    <Layout>
      <GameShell
        title="神奇植物園"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="garden"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-center px-2">
            按照順序種{currentPlant?.name || "植物"}！
          </h3>

          {/* Progress Steps */}
          <div className="flex gap-1 sm:gap-2 items-center">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg
                    transition-all ${completedSteps.includes(step.id) 
                      ? 'bg-green-400 text-white' 
                      : idx === currentStep 
                        ? 'bg-white border-2 border-green-400 animate-pulse' 
                        : 'bg-white/50'}
                  `}
                >
                  {step.icon}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-4 sm:w-6 h-1 ${completedSteps.includes(step.id) ? 'bg-green-400' : 'bg-white/30'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Garden Pot */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            {/* Pot */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-20 sm:h-24 bg-amber-600 rounded-b-3xl border-4 border-amber-700">
              <div className="absolute top-0 left-0 right-0 h-4 bg-amber-700 rounded-t-lg" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-8 sm:h-10 bg-amber-900 rounded-full opacity-50" />
            </div>

            {/* Plant Growth */}
            <AnimatePresence mode="wait">
              {growthStage !== "empty" && (
                <motion.div
                  key={growthStage}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 text-5xl sm:text-6xl md:text-7xl"
                >
                  {growthStage === "seed" && currentPlant?.seed}
                  {growthStage === "sprout" && currentPlant?.sprout}
                  {growthStage === "flower" && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      {currentPlant?.flower}
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sparkles on flower */}
            {showFlower && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: 3 }}
                className="absolute top-8 left-1/2 -translate-x-1/2"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            {STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === STEPS.findIndex(s => s.id === step.id);
              
              return (
                <motion.button
                  key={step.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStep(step.id)}
                  disabled={isCompleted || showFlower}
                  className={`
                    px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base
                    shadow-lg border-2 border-white/50 flex items-center gap-1 sm:gap-2
                    transition-all min-w-[80px] sm:min-w-[100px] justify-center
                    ${isCompleted 
                      ? 'bg-gray-300 text-gray-500' 
                      : isCurrent 
                        ? 'bg-[hsl(var(--macaron-green))] text-white ring-2 ring-white animate-pulse' 
                        : 'bg-white/80 text-gray-700'}
                    disabled:cursor-not-allowed
                  `}
                  data-testid={`step-${step.id}`}
                >
                  <span className="text-lg sm:text-xl">{step.icon}</span>
                  <span className="hidden sm:inline">{step.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Current Step Hint */}
          <div className="bg-white/40 px-4 py-2 rounded-full text-sm sm:text-base font-medium">
            {currentStep < STEPS.length 
              ? `下一步：${STEPS[currentStep].action}`
              : "完成！等待開花..."}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
