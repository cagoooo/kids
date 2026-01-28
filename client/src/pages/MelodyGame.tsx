import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";

const NOTES = [
  { id: "do", name: "Do", frequency: 261.63, animal: "🐱", color: "hsl(var(--macaron-pink))" },
  { id: "re", name: "Re", frequency: 293.66, animal: "🐶", color: "hsl(var(--macaron-blue))" },
  { id: "mi", name: "Mi", frequency: 329.63, animal: "🐥", color: "hsl(var(--macaron-yellow))" },
  { id: "fa", name: "Fa", frequency: 349.23, animal: "🐰", color: "hsl(var(--macaron-green))" },
  { id: "sol", name: "Sol", frequency: 392.00, animal: "🐻", color: "hsl(var(--macaron-purple))" },
];

const MELODIES = [
  { name: "小星星開頭", notes: ["do", "do", "sol", "sol"] },
  { name: "簡單上升", notes: ["do", "re", "mi"] },
  { name: "簡單下降", notes: ["mi", "re", "do"] },
  { name: "跳躍", notes: ["do", "mi", "sol"] },
  { name: "來回", notes: ["do", "re", "do"] },
];

function playNote(frequency: number, duration = 0.3) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

export default function MelodyGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentMelody, setCurrentMelody] = useState(MELODIES[0]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const { speak } = useTTS();

  const playMelody = useCallback(async () => {
    setIsPlaying(true);
    speak("仔細聽喔！");
    
    for (let i = 0; i < currentMelody.notes.length; i++) {
      const noteId = currentMelody.notes[i];
      const note = NOTES.find(n => n.id === noteId)!;
      
      setHighlightedNote(noteId);
      playNote(note.frequency, 0.4);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedNote(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsPlaying(false);
    speak("換你了！");
  }, [currentMelody, speak]);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const melody = MELODIES[Math.floor(Math.random() * MELODIES.length)];
    setCurrentMelody(melody);
    setPlayerSequence([]);
    setShowResult(null);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  useEffect(() => {
    if (currentMelody && !isGameOver) {
      const timer = setTimeout(() => playMelody(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentMelody, isGameOver]);

  const handleNoteClick = (noteId: string) => {
    if (isPlaying) return;
    
    const note = NOTES.find(n => n.id === noteId)!;
    playNote(note.frequency);
    setHighlightedNote(noteId);
    setTimeout(() => setHighlightedNote(null), 200);
    
    const newSequence = [...playerSequence, noteId];
    setPlayerSequence(newSequence);
    
    const targetNote = currentMelody.notes[playerSequence.length];
    
    if (noteId !== targetNote) {
      speak("再試試看！");
      setShowResult("wrong");
      setTimeout(() => {
        setPlayerSequence([]);
        setShowResult(null);
      }, 1000);
      return;
    }
    
    if (newSequence.length === currentMelody.notes.length) {
      confetti({ particleCount: 40, spread: 60, colors: ['#FFC0CB', '#87CEEB', '#98FB98'] });
      speak("太棒了！");
      setShowResult("correct");
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 1000);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
    setPlayerSequence([]);
  };

  return (
    <Layout>
      <GameShell
        title="DoReMi 音樂會"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="melody"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
      >
        <div className="flex flex-col items-center gap-6">
          <h3 className="font-display text-2xl font-bold text-center">
            {isPlaying ? "仔細聽旋律..." : "跟著彈奏一樣的旋律！"}
          </h3>

          {/* Progress dots */}
          <div className="flex gap-2 mb-4">
            {currentMelody.notes.map((_, idx) => (
              <div 
                key={idx}
                className={`w-4 h-4 rounded-full transition-all ${
                  idx < playerSequence.length 
                    ? showResult === "wrong" ? "bg-red-400" : "bg-white" 
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Animal Notes */}
          <div className="flex gap-3 flex-wrap justify-center">
            {NOTES.map((note) => (
              <motion.button
                key={note.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: highlightedNote === note.id ? 1.2 : 1,
                  boxShadow: highlightedNote === note.id ? "0 0 30px rgba(255,255,255,0.8)" : "none"
                }}
                onClick={() => handleNoteClick(note.id)}
                disabled={isPlaying}
                className={`
                  w-20 h-24 md:w-24 md:h-28 rounded-2xl flex flex-col items-center justify-center gap-1
                  shadow-lg border-4 border-white transition-all
                  ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{ backgroundColor: note.color }}
                data-testid={`note-${note.id}`}
              >
                <span className="text-4xl md:text-5xl">{note.animal}</span>
                <span className="font-display font-bold text-sm text-white/80">{note.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Replay button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playMelody}
            disabled={isPlaying}
            className="mt-4 bg-white/40 px-6 py-3 rounded-full font-bold text-lg disabled:opacity-50"
            data-testid="button-replay"
          >
            {isPlaying ? "播放中..." : "再聽一次"}
          </motion.button>
        </div>
      </GameShell>
    </Layout>
  );
}
