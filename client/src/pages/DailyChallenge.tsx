import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { useDailyChallenge } from "@/hooks/use-daily-challenge";
import { motion } from "framer-motion";
import { Apple } from "lucide-react";
import { SpeakableOption } from "@/components/SpeakableOption";
import { MathProblem } from "@/utils/math-logic";
import { ColorProblem } from "@/utils/color-logic";
import { EnglishProblem } from "@/utils/english-logic";
import confetti from "canvas-confetti";

export default function DailyChallenge() {
    const { state, startChallenge, answerQuestion } = useDailyChallenge();
    const [shake, setShake] = useState(false);

    // Auto-start if not started (or show a start button, but auto-start is smoother here)
    useEffect(() => {
        if (!state.isStarted && !state.isCompleted) {
            startChallenge();
        }
    }, [state.isStarted, state.isCompleted]);

    const currentQuestion = state.questions[state.currentIndex];

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            confetti({ particleCount: 30, spread: 50, colors: ['#FFD700'] });
            setTimeout(() => answerQuestion(true), 500);
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            // Optional: penalty or just wait? For kids, maybe just shake and let them try again?
            // But for "Challenge", maybe we should record it as wrong but let them proceed?
            // For now, let's stick to "must get it right to proceed" but maybe no score penalty in this simple version
            // Or better: answerQuestion(false) immediately to move to next? 
            // Let's keep it "must answer correctly" for learning value, but maybe reduce potential score?
            // For simplicity: Shake and retry.
        }
    };

    if (state.isCompleted) {
        return (
            <Layout>
                <GameShell
                    title="每日挑戰"
                    score={state.score}
                    totalQuestions={5}
                    currentQuestionIndex={5}
                    gameType="math" // Placeholder
                    isGameOver={true}
                    onRestart={() => { }} // Daily challenge can't be restarted immediately usually
                    colorClass="bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">挑戰完成！</h2>
                        <p className="text-xl">明天再來玩喔！</p>
                    </div>
                </GameShell>
            </Layout>
        );
    }

    if (!currentQuestion) return null;

    return (
        <Layout>
            <GameShell
                title="每日挑戰"
                score={state.score}
                totalQuestions={5}
                currentQuestionIndex={state.currentIndex}
                gameType="math" // Placeholder
                isGameOver={false}
                onRestart={() => { }}
                colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
            >
                <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
                    {/* Question Renderer */}
                    {currentQuestion.type === 'math' && (
                        <MathRenderer
                            problem={currentQuestion.data as MathProblem}
                            onAnswer={handleAnswer}
                            shake={shake}
                        />
                    )}
                    {currentQuestion.type === 'color' && (
                        <ColorRenderer
                            problem={currentQuestion.data as ColorProblem}
                            onAnswer={handleAnswer}
                            shake={shake}
                        />
                    )}
                    {currentQuestion.type === 'english' && (
                        <EnglishRenderer
                            problem={currentQuestion.data as EnglishProblem}
                            onAnswer={handleAnswer}
                            shake={shake}
                        />
                    )}
                </div>
            </GameShell>
        </Layout>
    );
}

// Sub-components for rendering specific question types

function MathRenderer({ problem, onAnswer, shake }: { problem: MathProblem, onAnswer: (c: boolean) => void, shake: boolean }) {
    return (
        <>
            {/* Visual Aid */}
            {problem.op === '+' && problem.a + problem.b <= 10 && (
                <div className="flex gap-4 items-center bg-white/30 p-3 rounded-2xl">
                    <div className="flex gap-1">
                        {Array.from({ length: problem.a }).map((_, i) => (
                            <Apple key={`a-${i}`} className="w-6 h-6 fill-red-400 text-red-600" />
                        ))}
                    </div>
                    <div className="text-2xl font-black">+</div>
                    <div className="flex gap-1">
                        {Array.from({ length: problem.b }).map((_, i) => (
                            <Apple key={`b-${i}`} className="w-6 h-6 fill-red-400 text-red-600" />
                        ))}
                    </div>
                </div>
            )}

            <motion.div
                animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
                className="bg-white/80 backdrop-blur-md px-12 py-8 rounded-[2rem] shadow-lg"
            >
                <span className="font-display text-6xl font-black tracking-wider text-[hsl(var(--macaron-purple-dark))]">
                    {problem.a} {problem.op} {problem.b} = ?
                </span>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {problem.options.map((opt, idx) => (
                    <SpeakableOption
                        key={idx}
                        speakText={String(opt)}
                        onSelect={() => onAnswer(opt === problem.ans)}
                        className="btn-macaron bg-white text-3xl py-6 rounded-2xl text-[hsl(var(--macaron-purple-dark))]"
                    >
                        {opt}
                    </SpeakableOption>
                ))}
            </div>
        </>
    );
}

function ColorRenderer({ problem, onAnswer, shake }: { problem: ColorProblem, onAnswer: (c: boolean) => void, shake: boolean }) {
    return (
        <>
            <motion.div
                animate={{
                    scale: [0.9, 1.1, 1],
                    rotate: shake ? [-5, 5, -5, 5, 0] : 0
                }}
                className="w-48 h-48 rounded-[2rem] shadow-2xl border-8 border-white"
                style={{ backgroundColor: problem.target.hex }}
            />

            <h3 className="font-display text-2xl font-bold">這是什麼顏色？</h3>

            <div className="grid grid-cols-2 gap-4 w-full mt-2">
                {problem.options.map((opt, idx) => (
                    <SpeakableOption
                        key={idx}
                        speakText={opt.name}
                        onSelect={() => onAnswer(opt.id === problem.target.id)}
                        className="btn-macaron bg-white text-xl py-4 rounded-2xl text-[hsl(var(--macaron-purple-dark))]"
                    >
                        {opt.name}
                    </SpeakableOption>
                ))}
            </div>
        </>
    );
}

function EnglishRenderer({ problem, onAnswer, shake }: { problem: EnglishProblem, onAnswer: (c: boolean) => void, shake: boolean }) {
    return (
        <>
            <motion.div
                animate={{ rotate: shake ? [-5, 5, -5, 5, 0] : 0 }}
                className="bg-white/80 backdrop-blur-md p-8 rounded-full shadow-lg w-48 h-48 flex items-center justify-center border-8 border-white"
            >
                {problem.mode === "emoji-to-word" ? (
                    <span className="text-8xl filter drop-shadow-md">{problem.target.emoji}</span>
                ) : (
                    <div className="text-center">
                        <span className="font-display text-3xl font-bold block">{problem.target.word}</span>
                        <span className="text-xl text-muted-foreground">({problem.target.chinese})</span>
                    </div>
                )}
            </motion.div>

            <h3 className="font-display text-2xl font-bold">
                {problem.mode === "emoji-to-word" ? "這是什麼？" : "選出正確的圖案！"}
            </h3>

            <div className="grid grid-cols-2 gap-4 w-full mt-2">
                {problem.options.map((opt, idx) => (
                    <SpeakableOption
                        key={idx}
                        speakText={problem.mode === "emoji-to-word" ? `${opt.word}，${opt.chinese}` : opt.chinese}
                        onSelect={() => onAnswer(opt.word === problem.target.word)}
                        className="btn-macaron bg-white py-4 rounded-2xl text-[hsl(var(--macaron-purple-dark))]"
                    >
                        {problem.mode === "emoji-to-word" ? (
                            <div className="text-center">
                                <span className="text-xl font-bold font-display block">{opt.word}</span>
                                <span className="text-sm text-muted-foreground">({opt.chinese})</span>
                            </div>
                        ) : (
                            <span className="text-5xl">{opt.emoji}</span>
                        )}
                    </SpeakableOption>
                ))}
            </div>
        </>
    );
}
