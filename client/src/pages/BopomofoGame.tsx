import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";

const BOPOMOFO_WORDS = [
  { word: "蘋果", emoji: "🍎", initial: "ㄆ", pinyin: "píng guǒ" },
  { word: "香蕉", emoji: "🍌", initial: "ㄒ", pinyin: "xiāng jiāo" },
  { word: "貓咪", emoji: "🐱", initial: "ㄇ", pinyin: "māo mī" },
  { word: "狗狗", emoji: "🐶", initial: "ㄍ", pinyin: "gǒu gǒu" },
  { word: "兔子", emoji: "🐰", initial: "ㄊ", pinyin: "tù zi" },
  { word: "太陽", emoji: "☀️", initial: "ㄊ", pinyin: "tài yáng" },
  { word: "月亮", emoji: "🌙", initial: "ㄩ", pinyin: "yuè liàng" },
  { word: "星星", emoji: "⭐", initial: "ㄒ", pinyin: "xīng xīng" },
  { word: "花朵", emoji: "🌸", initial: "ㄏ", pinyin: "huā duǒ" },
  { word: "蝴蝶", emoji: "🦋", initial: "ㄏ", pinyin: "hú dié" },
  { word: "鳥兒", emoji: "🐦", initial: "ㄋ", pinyin: "niǎo ér" },
  { word: "魚兒", emoji: "🐠", initial: "ㄩ", pinyin: "yú ér" },
];

const ALL_INITIALS = ["ㄅ", "ㄆ", "ㄇ", "ㄈ", "ㄉ", "ㄊ", "ㄋ", "ㄌ", "ㄍ", "ㄎ", "ㄏ", "ㄐ", "ㄑ", "ㄒ", "ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ", "ㄧ", "ㄨ", "ㄩ"];

export default function BopomofoGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(BOPOMOFO_WORDS[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState<string[]>([]);
  const [trainPosition, setTrainPosition] = useState(-100);
  const { speak } = useTTS();

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const word = BOPOMOFO_WORDS[Math.floor(Math.random() * BOPOMOFO_WORDS.length)];
    setCurrentWord(word);
    
    const distractors = ALL_INITIALS
      .filter(i => i !== word.initial)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    setOptions([word.initial, ...distractors].sort(() => 0.5 - Math.random()));
    setPoppedBalloons([]);
    setTrainPosition(-100);
    
    setTimeout(() => {
      setTrainPosition(50);
      speak(`${word.word}的聲母是什麼？`);
    }, 100);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleBalloonClick = (initial: string) => {
    if (poppedBalloons.includes(initial)) return;
    
    setPoppedBalloons(prev => [...prev, initial]);
    
    if (initial === currentWord.initial) {
      confetti({
        particleCount: 50,
        spread: 70,
        colors: ['#FFC0CB', '#87CEEB', '#98FB98', '#DDA0DD'],
        origin: { y: 0.3 }
      });
      speak("太棒了！答對了！");
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 1000);
    } else {
      speak("再試試看！");
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
  };

  const balloonColors = [
    "bg-[hsl(var(--macaron-pink))]",
    "bg-[hsl(var(--macaron-blue))]",
    "bg-[hsl(var(--macaron-green))]",
  ];

  return (
    <Layout>
      <GameShell
        title="注音小火車"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="bopomofo"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <div className="flex flex-col items-center gap-4 sm:gap-6 relative overflow-hidden min-h-[350px] sm:min-h-[400px]">
          {/* Balloons at top */}
          <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center">
            {options.map((initial, idx) => (
              <AnimatePresence key={initial}>
                {!poppedBalloons.includes(initial) && (
                  <motion.button
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -100 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBalloonClick(initial)}
                    className={`
                      w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-full relative
                      ${balloonColors[idx % 3]}
                      shadow-lg flex items-center justify-center
                      cursor-pointer
                    `}
                    data-testid={`balloon-${initial}`}
                  >
                    <span className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {initial}
                    </span>
                    {/* Balloon string */}
                    <div className="absolute -bottom-4 sm:-bottom-6 w-0.5 h-4 sm:h-6 bg-gray-400" />
                  </motion.button>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* Question */}
          <div className="bg-white/40 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl mt-2 sm:mt-4">
            <h3 className="font-display text-lg sm:text-xl font-bold text-center">
              「{currentWord.word}」的聲母是什麼？
            </h3>
            <p className="text-center text-xs sm:text-sm opacity-70">戳破正確的氣球！</p>
          </div>

          {/* Train */}
          <motion.div
            animate={{ x: trainPosition }}
            transition={{ type: "spring", stiffness: 50 }}
            className="absolute bottom-0 flex items-end scale-75 sm:scale-90 md:scale-100 origin-bottom"
          >
            {/* Train engine */}
            <div className="bg-[hsl(var(--macaron-pink))] w-24 h-16 rounded-t-2xl relative">
              <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full" />
              <div className="absolute bottom-0 left-2 w-8 h-8 bg-gray-700 rounded-full" />
              <div className="absolute bottom-0 right-2 w-8 h-8 bg-gray-700 rounded-full" />
              <div className="absolute -top-4 right-2 w-4 h-6 bg-gray-600 rounded-t-full" />
            </div>
            
            {/* Train car with item */}
            <div className="bg-[hsl(var(--macaron-yellow))] w-20 h-14 rounded-t-xl ml-1 flex items-center justify-center relative">
              <span className="text-4xl">{currentWord.emoji}</span>
              <div className="absolute bottom-0 left-2 w-6 h-6 bg-gray-700 rounded-full" />
              <div className="absolute bottom-0 right-2 w-6 h-6 bg-gray-700 rounded-full" />
            </div>
          </motion.div>

          {/* Track */}
          <div className="absolute bottom-0 w-full h-3 sm:h-4 bg-amber-800 flex items-center overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-6 sm:w-8 h-1.5 sm:h-2 bg-amber-600 mx-1 sm:mx-2 flex-shrink-0" />
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
