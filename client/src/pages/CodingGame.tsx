import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";
import { Play, RotateCcw, ArrowUp, RotateCw } from "lucide-react";

type Direction = "up" | "right" | "down" | "left";
type Command = "forward" | "left" | "right";

interface Position {
  x: number;
  y: number;
  direction: Direction;
}

interface Level {
  grid: number[][];
  start: Position;
  goal: { x: number; y: number };
  maxCommands: number;
}

const LEVELS: Level[] = [
  {
    grid: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 2, 0],
      [0, 0, 0, 0],
    ],
    start: { x: 1, y: 1, direction: "right" },
    goal: { x: 2, y: 2 },
    maxCommands: 3,
  },
  {
    grid: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 2, 0],
    ],
    start: { x: 1, y: 1, direction: "down" },
    goal: { x: 2, y: 3 },
    maxCommands: 4,
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 1, y: 1, direction: "right" },
    goal: { x: 3, y: 3 },
    maxCommands: 5,
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 1, y: 1, direction: "down" },
    goal: { x: 3, y: 3 },
    maxCommands: 6,
  },
  {
    grid: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 2, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 1, y: 1, direction: "down" },
    goal: { x: 3, y: 3 },
    maxCommands: 7,
  },
];

const COMMANDS_INFO: Record<Command, { name: string; icon: typeof ArrowUp; color: string }> = {
  forward: { name: "前進", icon: ArrowUp, color: "bg-[hsl(var(--macaron-green))]" },
  left: { name: "左轉", icon: RotateCcw, color: "bg-[hsl(var(--macaron-blue))]" },
  right: { name: "右轉", icon: RotateCw, color: "bg-[hsl(var(--macaron-pink))]" },
};

function getNextDirection(current: Direction, turn: "left" | "right"): Direction {
  const dirs: Direction[] = ["up", "right", "down", "left"];
  const idx = dirs.indexOf(current);
  if (turn === "left") return dirs[(idx + 3) % 4];
  return dirs[(idx + 1) % 4];
}

function getForwardPosition(pos: Position): { x: number; y: number } {
  switch (pos.direction) {
    case "up": return { x: pos.x, y: pos.y - 1 };
    case "down": return { x: pos.x, y: pos.y + 1 };
    case "left": return { x: pos.x - 1, y: pos.y };
    case "right": return { x: pos.x + 1, y: pos.y };
  }
}

function getRotation(direction: Direction): number {
  switch (direction) {
    case "up": return 0;
    case "right": return 90;
    case "down": return 180;
    case "left": return 270;
  }
}

export default function CodingGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [commands, setCommands] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bearPosition, setBearPosition] = useState<Position | null>(null);
  const [showResult, setShowResult] = useState<"success" | "fail" | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  const currentLevel = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];

  useEffect(() => {
    if (levelIndex >= 5) {
      setIsGameOver(true);
      return;
    }
    setBearPosition(currentLevel.start);
    setCommands([]);
    setShowResult(null);
    speak("排列指令，幫助小熊找到蜂蜜！");
  }, [levelIndex]);

  const addCommand = (cmd: Command) => {
    if (commands.length < currentLevel.maxCommands && !isRunning) {
      setCommands([...commands, cmd]);
    }
  };

  const removeCommand = (index: number) => {
    if (!isRunning) {
      setCommands(commands.filter((_, i) => i !== index));
    }
  };

  const clearCommands = () => {
    if (!isRunning) {
      setCommands([]);
    }
  };

  const executeCommands = useCallback(async () => {
    if (commands.length === 0) {
      speak("請先排列指令！");
      return;
    }

    setIsRunning(true);
    let pos = { ...currentLevel.start };

    for (const cmd of commands) {
      await new Promise(resolve => setTimeout(resolve, 600));

      if (cmd === "forward") {
        const next = getForwardPosition(pos);
        if (
          next.x >= 0 && next.x < currentLevel.grid[0].length &&
          next.y >= 0 && next.y < currentLevel.grid.length &&
          currentLevel.grid[next.y][next.x] !== 0
        ) {
          pos = { ...pos, x: next.x, y: next.y };
        }
      } else if (cmd === "left") {
        pos = { ...pos, direction: getNextDirection(pos.direction, "left") };
      } else if (cmd === "right") {
        pos = { ...pos, direction: getNextDirection(pos.direction, "right") };
      }

      setBearPosition({ ...pos });
    }

    await new Promise(resolve => setTimeout(resolve, 400));

    if (pos.x === currentLevel.goal.x && pos.y === currentLevel.goal.y) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      speak("太棒了！小熊找到蜂蜜了！");
      setShowResult("success");
      setScore(s => s + 20);
      setTimeout(() => {
        setLevelIndex(i => i + 1);
      }, 1500);
    } else {
      speak("差一點點，再試試看！");
      setShowResult("fail");
      setTimeout(() => {
        setBearPosition(currentLevel.start);
        setCommands([]);
        setShowResult(null);
      }, 1500);
    }

    setIsRunning(false);
  }, [commands, currentLevel, speak]);

  const restart = () => {
    setLevelIndex(0);
    setScore(0);
    setIsGameOver(false);
    setCommands([]);
    setShowResult(null);
  };

  const cellSize = 48;

  return (
    <Layout>
      <GameShell
        title="程式探險隊"
        score={score}
        totalQuestions={5}
        currentQuestionIndex={levelIndex}
        gameType="coding"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-center px-2">
            第 {levelIndex + 1} 關：幫小熊找到蜂蜜！
          </h3>

          {/* Grid Map */}
          <div 
            className="relative bg-green-100 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-inner border-2 sm:border-4 border-green-200"
            style={{ 
              width: currentLevel.grid[0].length * cellSize + 24,
              height: currentLevel.grid.length * cellSize + 24 
            }}
          >
            {currentLevel.grid.map((row, y) => (
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`absolute rounded-lg transition-all ${
                    cell === 0 ? 'bg-green-800/30' : 'bg-amber-100 border-2 border-amber-200'
                  }`}
                  style={{
                    left: x * cellSize + 12,
                    top: y * cellSize + 12,
                    width: cellSize - 4,
                    height: cellSize - 4,
                  }}
                >
                  {cell === 2 && (
                    <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl">
                      🍯
                    </span>
                  )}
                </div>
              ))
            ))}

            {/* Bear */}
            {bearPosition && (
              <motion.div
                className="absolute flex items-center justify-center text-2xl sm:text-3xl"
                animate={{
                  left: bearPosition.x * cellSize + 12 + (cellSize - 4) / 2 - 16,
                  top: bearPosition.y * cellSize + 12 + (cellSize - 4) / 2 - 16,
                  rotate: getRotation(bearPosition.direction),
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ width: 32, height: 32 }}
              >
                🐻
              </motion.div>
            )}
          </div>

          {/* Command Palette */}
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            {(Object.keys(COMMANDS_INFO) as Command[]).map((cmd) => {
              const info = COMMANDS_INFO[cmd];
              const Icon = info.icon;
              return (
                <motion.button
                  key={cmd}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addCommand(cmd)}
                  disabled={isRunning || commands.length >= currentLevel.maxCommands}
                  className={`
                    ${info.color} text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base
                    shadow-lg border-2 border-white/50 disabled:opacity-50 flex items-center gap-1 sm:gap-2
                  `}
                  data-testid={`cmd-${cmd}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{info.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Command Queue */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">
              指令列 ({commands.length}/{currentLevel.maxCommands})
            </span>
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center min-h-[44px] bg-white/40 rounded-xl px-3 py-2">
              <AnimatePresence>
                {commands.map((cmd, idx) => {
                  const info = COMMANDS_INFO[cmd];
                  const Icon = info.icon;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={() => removeCommand(idx)}
                      disabled={isRunning}
                      className={`
                        ${info.color} text-white w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center
                        shadow-md border-2 border-white/50 disabled:opacity-50
                      `}
                      title="點擊移除"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {commands.length === 0 && (
                <span className="text-gray-400 text-sm py-1">點擊上方按鈕添加指令</span>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={executeCommands}
              disabled={isRunning || commands.length === 0}
              className="bg-[hsl(var(--macaron-yellow))] text-[hsl(var(--macaron-yellow-dark))] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-lg disabled:opacity-50 flex items-center gap-2"
              data-testid="button-run"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              執行
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCommands}
              disabled={isRunning}
              className="bg-white/50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-lg disabled:opacity-50 flex items-center gap-2"
              data-testid="button-clear"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              清除
            </motion.button>
          </div>

          {/* Result Message */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`
                  px-6 py-3 rounded-full font-bold text-lg
                  ${showResult === "success" ? "bg-green-400 text-white" : "bg-red-400 text-white"}
                `}
              >
                {showResult === "success" ? "成功！🎉" : "再試一次！💪"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GameShell>
    </Layout>
  );
}
