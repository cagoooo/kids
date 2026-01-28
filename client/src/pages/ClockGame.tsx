import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";

const TIMES = [
  { hour: 1, display: "1 點鐘", scenario: "早起運動" },
  { hour: 2, display: "2 點鐘", scenario: "午睡時間" },
  { hour: 3, display: "3 點鐘", scenario: "下午點心" },
  { hour: 4, display: "4 點鐘", scenario: "放學回家" },
  { hour: 5, display: "5 點鐘", scenario: "準備晚餐" },
  { hour: 6, display: "6 點鐘", scenario: "吃晚餐" },
  { hour: 7, display: "7 點鐘", scenario: "寫功課" },
  { hour: 8, display: "8 點鐘", scenario: "準備睡覺" },
  { hour: 9, display: "9 點鐘", scenario: "說晚安" },
  { hour: 10, display: "10 點鐘", scenario: "甜甜入睡" },
  { hour: 11, display: "11 點鐘", scenario: "深夜時分" },
  { hour: 12, display: "12 點鐘", scenario: "中午吃飯" },
];

function Clock({ hour, onHourChange, interactive = true }: { hour: number; onHourChange?: (h: number) => void; interactive?: boolean }) {
  const hourAngle = (hour % 12) * 30 - 90;
  
  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onHourChange) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    const newHour = Math.round(angle / 30) || 12;
    onHourChange(newHour);
  };

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`w-56 h-56 md:w-72 md:h-72 ${interactive ? 'cursor-pointer' : ''}`}
      onClick={handleClockClick}
    >
      {/* Clock face */}
      <circle cx="100" cy="100" r="95" fill="white" stroke="hsl(var(--macaron-blue))" strokeWidth="8" />
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 100 + 75 * Math.cos(angle);
        const y1 = 100 + 75 * Math.sin(angle);
        const x2 = 100 + 85 * Math.cos(angle);
        const y2 = 100 + 85 * Math.sin(angle);
        const textX = 100 + 65 * Math.cos(angle);
        const textY = 100 + 65 * Math.sin(angle);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--macaron-purple-dark))" strokeWidth="3" />
            <text 
              x={textX} 
              y={textY} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontSize="16" 
              fontWeight="bold"
              fill="hsl(var(--macaron-purple-dark))"
            >
              {i === 0 ? 12 : i}
            </text>
          </g>
        );
      })}
      
      {/* Center dot */}
      <circle cx="100" cy="100" r="8" fill="hsl(var(--macaron-pink))" />
      
      {/* Hour hand (candy stick style) */}
      <motion.line
        x1="100"
        y1="100"
        x2={100 + 50 * Math.cos(hourAngle * Math.PI / 180)}
        y2={100 + 50 * Math.sin(hourAngle * Math.PI / 180)}
        stroke="hsl(var(--macaron-pink))"
        strokeWidth="8"
        strokeLinecap="round"
        animate={{ x2: 100 + 50 * Math.cos(hourAngle * Math.PI / 180), y2: 100 + 50 * Math.sin(hourAngle * Math.PI / 180) }}
        transition={{ type: "spring", stiffness: 100 }}
      />
      
      {/* Minute hand (always at 12) */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        stroke="hsl(var(--macaron-blue))"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ClockGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetTime, setTargetTime] = useState(TIMES[0]);
  const [selectedHour, setSelectedHour] = useState(12);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const { speak } = useTTS();

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const time = TIMES[Math.floor(Math.random() * TIMES.length)];
    setTargetTime(time);
    setSelectedHour(12);
    
    speak(`請把時鐘撥到 ${time.display}`);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleCheck = () => {
    if (selectedHour === targetTime.hour) {
      confetti({ particleCount: 40, spread: 60, colors: ['#87CEEB', '#FFC0CB'] });
      speak("答對了！");
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 800);
    } else {
      speak("再試試看！");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <Layout>
      <GameShell
        title="時鐘小管家"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="clock"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-blue))] text-[hsl(var(--macaron-blue-dark))]"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white/40 px-6 py-3 rounded-2xl">
            <h3 className="font-display text-2xl font-bold text-center">
              現在是 {targetTime.display}
            </h3>
            <p className="text-center text-lg opacity-80">{targetTime.scenario}</p>
          </div>

          {/* Clock */}
          <motion.div
            animate={{ rotate: shake ? [-5, 5, -5, 5, 0] : 0 }}
            className="bg-white/20 p-4 rounded-full"
          >
            <Clock 
              hour={selectedHour} 
              onHourChange={setSelectedHour}
              interactive={true}
            />
          </motion.div>

          <p className="text-lg font-medium opacity-80">
            點擊時鐘上的數字來調整時間
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCheck}
            className="bg-white text-[hsl(var(--macaron-blue-dark))] font-bold text-xl px-8 py-4 rounded-2xl shadow-lg"
            data-testid="button-check"
          >
            確認答案
          </motion.button>
        </div>
      </GameShell>
    </Layout>
  );
}
