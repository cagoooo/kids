import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { useSound } from "@/hooks/use-sound-context";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

type MoleState = "hidden" | "mole" | "golden" | "bomb";

export default function MoleGame() {
    const [grid, setGrid] = useState<MoleState[]>(Array(9).fill("hidden"));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const { playClick, playCorrect, playWrong } = useSound();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            stopGame();
        };
    }, []);

    useEffect(() => {
        if (isPlaying && timeLeft === 0) {
            finishGame();
        }
    }, [timeLeft, isPlaying]);

    const startGame = () => {
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        setTimeLeft(30);
        setGrid(Array(9).fill("hidden"));
        playClick();

        // Start timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        // Start mole loop
        moleLoop();
    };

    const stopGame = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        setIsPlaying(false);
    };

    const finishGame = () => {
        stopGame();
        setIsGameOver(true);
    };

    const moleLoop = () => {
        if (!isPlaying && timeLeft <= 0) return;

        // Determine interval based on time left (speed up as time goes)
        const speed = Math.max(500, 1000 - (30 - timeLeft) * 15);

        moleTimerRef.current = setTimeout(() => {
            showMole();
            moleLoop();
        }, speed);
    };

    const showMole = () => {
        setGrid((prev) => {
            const newGrid = [...prev];
            // Hide existing moles first (optional, or allow multiple)
            // Let's clear 50% chance to clean board slightly to prevent clutter
            if (Math.random() > 0.5) {
                for (let i = 0; i < 9; i++) newGrid[i] = "hidden";
            }

            // Pick a random spot
            const idx = Math.floor(Math.random() * 9);

            // Determine type
            const rand = Math.random();
            let type: MoleState = "mole";
            if (rand > 0.8) type = "golden"; // 20% chance
            if (rand < 0.1) type = "bomb";   // 10% chance

            newGrid[idx] = type;
            return newGrid;
        });

        // Auto-hide after some time if not clicked
        setTimeout(() => {
            setGrid(prev => {
                const newGrid = [...prev];
                // Only hide if it hasn't changed (tricky in react batching, but good enough for simple game)
                // Actually, simplified: just let next loop overwrite or clear.
                return newGrid;
            });
        }, 1500);
    };

    const whack = (index: number) => {
        if (!isPlaying || grid[index] === "hidden") return;

        const type = grid[index];
        const newGrid = [...grid];
        newGrid[index] = "hidden";
        setGrid(newGrid);

        if (type === "bomb") {
            setScore(s => Math.max(0, s - 5));
            playWrong();
        } else if (type === "golden") {
            setScore(s => s + 5);
            playCorrect();
        } else {
            setScore(s => s + 1);
            playClick(); // Or a specific whack sound
        }
    };

    return (
        <Layout>
            <GameShell
                title="打地鼠大挑戰"
                score={score}
                totalQuestions={30} // Treat seconds as "progress" sort of
                currentQuestionIndex={30 - timeLeft}
                gameType="math" // Placeholder
                isGameOver={isGameOver}
                onRestart={startGame}
                colorClass="bg-gradient-to-br from-green-400 to-teal-500 text-white"
            >
                <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">

                    {!isPlaying && !isGameOver && (
                        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl text-center shadow-xl">
                            <h3 className="text-3xl font-black text-[hsl(var(--macaron-green-dark))] mb-4">準備好了嗎？</h3>
                            <p className="text-lg text-gray-600 mb-6 font-bold">
                                點擊跳出來的地鼠！<br />
                                <span className="text-yellow-500">金色地鼠 +5 分</span><br />
                                <span className="text-red-500">炸彈 -5 分</span>
                            </p>
                            <Button
                                onClick={startGame}
                                className="btn-macaron bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))] text-2xl py-8 px-12 rounded-full w-full shadow-lg hover:scale-105 transition-transform"
                            >
                                <Play className="w-8 h-8 mr-2 fill-current" />
                                開始遊戲
                            </Button>
                        </div>
                    )}

                    {isPlaying && (
                        <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[400px] aspect-square">
                            {grid.map((type, i) => (
                                <div
                                    key={i}
                                    className="bg-black/20 rounded-3xl relative overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-inner border-b-4 border-white/10"
                                    onClick={() => whack(i)}
                                >
                                    {/* Hole Bottom */}
                                    <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[40%] bg-black/40 rounded-full blur-md" />

                                    <AnimatePresence>
                                        {type !== "hidden" && (
                                            <motion.div
                                                initial={{ y: "100%" }}
                                                animate={{ y: "10%" }}
                                                exit={{ y: "100%" }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                            >
                                                <span className="text-6xl md:text-7xl filter drop-shadow-xl select-none">
                                                    {type === "mole" && "🐹"}
                                                    {type === "golden" && "👑"}
                                                    {type === "bomb" && "💣"}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}

                    {isPlaying && (
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-display text-2xl font-bold border-2 border-white/50">
                            剩餘時間: {timeLeft} 秒
                        </div>
                    )}

                </div>
            </GameShell>
        </Layout>
    );
}
