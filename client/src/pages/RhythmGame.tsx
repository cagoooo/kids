import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { AudioEngine, SONGS, Song } from "@/utils/audio-engine";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const HIT_ZONE_Y = 80; // Percentage from top (80%)
const SPEED = 30; // Speed factor (pixels per frame approx related) - actually we use time-based

export default function RhythmGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [selectedSong, setSelectedSong] = useState<Song>(SONGS[0]);
    const [gameNotes, setGameNotes] = useState<any[]>([]); // Visual notes
    const [feedback, setFeedback] = useState<{ text: string, type: string } | null>(null);

    // Refs for game loop
    const audioRef = useRef<AudioEngine | null>(null);
    const startTimeRef = useRef<number>(0);
    const reqRef = useRef<number>(0);

    useEffect(() => {
        audioRef.current = new AudioEngine();
        return () => cancelAnimationFrame(reqRef.current);
    }, []);

    const startGame = (song: Song) => {
        if (!audioRef.current) return;
        audioRef.current.resume();

        setIsPlaying(true);
        setScore(0);
        setCombo(0);
        setSelectedSong(song);

        // Pre-calculate note times
        const beatDuration = 60 / song.bpm;
        let currentTime = 0;
        const notesWithTime = song.melody.map((n, idx) => {
            const noteTime = currentTime;
            currentTime += n.duration * beatDuration;
            return { ...n, time: noteTime, id: idx, hit: false, missed: false };
        });

        setGameNotes(notesWithTime);
        startTimeRef.current = audioRef.current.ctx!.currentTime + 2; // Start in 2 seconds

        // Schedule audio
        notesWithTime.forEach(n => {
            audioRef.current?.playTone(n.note, n.duration * beatDuration, startTimeRef.current + n.time);
        });

        loop();
    };

    const loop = () => {
        if (!audioRef.current) return;
        const now = audioRef.current.ctx!.currentTime;
        const gameTime = now - startTimeRef.current;

        // Check for misses (notes that passed without hit)
        // We update state via functional update often, but in loop it's tricky.
        // For simplicity in React, we assume we just trigger renders efficiently or use refs for positions.
        // Actually, simple React state for 60fps might be jittery, but for kids game is ok.
        setGameNotes(prev => {
            return prev.map(n => {
                if (!n.hit && !n.missed && gameTime > n.time + 0.5) {
                    setCombo(0);
                    return { ...n, missed: true };
                }
                return n;
            });
        });

        if (gameTime < selectedSong.melody.length * (60 / selectedSong.bpm) * 2) { // Rough end check
            reqRef.current = requestAnimationFrame(loop);
        } else {
            setIsPlaying(false);
        }
    };

    const handleTap = () => {
        if (!isPlaying || !audioRef.current) return;
        const now = audioRef.current.ctx!.currentTime;
        const gameTime = now - startTimeRef.current;

        // Find nearest hittable note
        // Window: +/- 0.3s

        setGameNotes(prev => {
            const hittableIndex = prev.findIndex(n =>
                !n.hit && !n.missed && Math.abs(gameTime - n.time) < 0.3
            );

            if (hittableIndex !== -1) {
                const note = prev[hittableIndex];
                const diff = Math.abs(gameTime - note.time);

                let points = 0;
                let text = "";
                let type = "";

                if (diff < 0.1) {
                    points = 100;
                    text = "Perfect!!";
                    type = "text-yellow-500 text-4xl";
                } else if (diff < 0.2) {
                    points = 50;
                    text = "Great!";
                    type = "text-green-500 text-3xl";
                } else {
                    points = 20;
                    text = "Good";
                    type = "text-blue-500 text-2xl";
                }

                setScore(s => s + points);
                setCombo(c => c + 1);
                showFeedback(text, type);

                // Return new array with note marked hit
                const next = [...prev];
                next[hittableIndex] = { ...note, hit: true };
                return next;
            }

            return prev;
        });
    };

    const showFeedback = (text: string, type: string) => {
        setFeedback({ text, type });
        setTimeout(() => setFeedback(null), 500);
    };

    return (
        <Layout>
            <GameShell
                title="節奏達人"
                score={score}
                totalQuestions={0} // Endless/Song based
                currentQuestionIndex={0}
                gameType="melody" // Reusing melody type
                isGameOver={false}
                onRestart={() => setIsPlaying(false)}
                colorClass="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            >
                <div className="relative w-full h-[60vh] flex flex-col items-center overflow-hidden">

                    {/* Song Selection / Start Screen */}
                    {!isPlaying && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-3xl">
                            <Music className="w-20 h-20 text-white mb-4 animate-bounce" />
                            <h2 className="text-3xl font-black mb-6 text-white text-shadow">選擇一首歌</h2>
                            <div className="flex gap-4">
                                {SONGS.map(song => (
                                    <Button
                                        key={song.id}
                                        onClick={() => startGame(song)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl py-6 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                                    >
                                        {song.title}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Game Track */}
                    <div className="flex-1 w-full max-w-md bg-black/20 relative rounded-3xl border-4 border-white/20 my-4 overflow-hidden">

                        {/* Target Line */}
                        <div className="absolute bottom-20 left-0 right-0 h-1 bg-white/30" />
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 border-4 border-white rounded-full -mb-12 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/10 rounded-full animate-pulse" />
                        </div>

                        {/* Falling Notes */}
                        {isPlaying && gameNotes.map((note) => {
                            if (note.hit) return null; // Don't render hit notes

                            // Calculate position based on current time (need a raq loop for smooth ui, 
                            // but for react simple implementation we can use CSS animation if time is fixed,
                            // OR use a useFrame hook. Here we'll try a simpler approach:
                            // We actually need the render to be driven by the loop state to be smooth.
                            // But driving React state 60fps is heavy.
                            // CSS Animation Approach:
                            // We know the arrival time. We can set animation-delay.
                            // arrivalTime = startTime + note.time
                            // duration = 2s (time to fall from top to target)
                            // Start falling at: arrivalTime - 2s

                            // Let's rely on the global `isPlaying` re-render? No, it won't re-render entire tree 60fps.
                            // Effective tactic: Use CSS Transition on `top` is hard to sync with Audio.
                            // Best for React Kids Game: 
                            // Use `framer-motion` animate on mount?
                            // Let's assume note takes 2s to fall.

                            return (
                                <FallingNote
                                    key={note.id}
                                    delay={note.time}
                                    duration={2} // Falls for 2 seconds to reach target
                                    onMiss={() => { }} // Handled in loop
                                />
                            );
                        })}

                        {/* Feedback */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 2, opacity: 0 }}
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black ${feedback.type} text-shadow-lg z-30`}
                                >
                                    {feedback.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Combo */}
                        {combo > 1 && (
                            <div className="absolute top-10 right-10 text-right">
                                <div className="text-4xl font-black text-yellow-400 italic font-display">{combo}</div>
                                <div className="text-sm font-bold text-white uppercase">Combo!</div>
                            </div>
                        )}

                    </div>

                    {/* Tap Button (Big Area) */}
                    <button
                        className="w-full max-w-md h-32 mb-4 bg-gradient-to-t from-orange-400 to-orange-300 rounded-3xl shadow-[0_10px_0_rgb(200,100,0)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center"
                        onMouseDown={handleTap}
                        onTouchStart={(e) => { e.preventDefault(); handleTap(); }}
                    >
                        <span className="text-3xl font-black text-white text-shadow">TAP!</span>
                    </button>

                </div>
            </GameShell>
        </Layout>
    );
}

// Separate component for performance
function FallingNote({ delay, duration }: { delay: number, duration: number }) {
    // Note needs to arrive at bottom (80%) at `delay` seconds.
    // So it should start at `delay - duration`.
    // Since we start render at t=0, we can just use delay.

    return (
        <motion.div
            initial={{ y: -50, opacity: 1 }}
            animate={{ y: 500, opacity: 1 }} // 500px is approx target
            transition={{
                duration: duration,
                delay: delay, // Wait until it's time to start falling
                ease: "linear"
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-pink-400 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center"
        >
            <div className="w-8 h-8 rounded-full border-2 border-pink-200" />
        </motion.div>
    );
}
