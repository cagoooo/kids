import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";

const PUZZLES = [
  { id: 1, emoji: "🏠", name: "房子" },
  { id: 2, emoji: "🌸", name: "櫻花" },
  { id: 3, emoji: "🐱", name: "小貓" },
  { id: 4, emoji: "🌈", name: "彩虹" },
  { id: 5, emoji: "🎂", name: "蛋糕" },
  { id: 6, emoji: "🚗", name: "汽車" },
  { id: 7, emoji: "🌻", name: "向日葵" },
  { id: 8, emoji: "🦋", name: "蝴蝶" },
  { id: 9, emoji: "🎈", name: "氣球" },
  { id: 10, emoji: "⭐", name: "星星" },
];

const PIECE_LABELS = ["①", "②", "③", "④"];
const PIECE_COLORS = ["bg-red-100 border-red-300", "bg-blue-100 border-blue-300", "bg-green-100 border-green-300", "bg-yellow-100 border-yellow-300"];

function DraggablePiece({ id, pieceIndex, emoji }: { id: string; pieceIndex: number; emoji: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 1,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-20 h-20 md:w-24 md:h-24 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing border-2 ${PIECE_COLORS[pieceIndex]} ${isDragging ? 'opacity-80' : ''}`}
      whileHover={{ scale: 1.05 }}
      data-testid={`puzzle-piece-${pieceIndex}`}
    >
      <span className="text-3xl md:text-4xl">{emoji}</span>
      <span className="text-lg font-bold">{PIECE_LABELS[pieceIndex]}</span>
    </motion.div>
  );
}

function DroppableSlot({ id, slotIndex, children, isCorrect }: { id: string; slotIndex: number; children?: React.ReactNode; isCorrect?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
        isOver ? 'border-green-400 bg-green-50' : 
        isCorrect ? 'border-green-400 bg-green-100' : 'border-gray-300 bg-gray-50'
      }`}
      data-testid={`puzzle-slot-${id}`}
    >
      {children ? children : (
        <span className="text-2xl font-bold text-gray-400">{PIECE_LABELS[slotIndex]}</span>
      )}
    </div>
  );
}

export default function PuzzleGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
  const [pieces, setPieces] = useState<{ id: string; pieceIndex: number; placed: boolean }[]>([]);
  const [slots, setSlots] = useState<{ id: string; slotIndex: number; pieceId: string | null }[]>([]);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const puzzle = PUZZLES[questionIndex % PUZZLES.length];
    setCurrentPuzzle(puzzle);

    const initialPieces = [
      { id: 'piece-0', pieceIndex: 0, placed: false },
      { id: 'piece-1', pieceIndex: 1, placed: false },
      { id: 'piece-2', pieceIndex: 2, placed: false },
      { id: 'piece-3', pieceIndex: 3, placed: false },
    ];

    const shuffled = [...initialPieces].sort(() => 0.5 - Math.random());
    setPieces(shuffled);

    setSlots([
      { id: 'slot-0', slotIndex: 0, pieceId: null },
      { id: 'slot-1', slotIndex: 1, pieceId: null },
      { id: 'slot-2', slotIndex: 2, pieceId: null },
      { id: 'slot-3', slotIndex: 3, pieceId: null },
    ]);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const checkCompletion = (newSlots: typeof slots) => {
    const allCorrect = newSlots.every((slot) => {
      if (!slot.pieceId) return false;
      const pieceIndex = parseInt(slot.pieceId.split('-')[1]);
      return pieceIndex === slot.slotIndex;
    });
    
    if (allCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B']
      });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 800);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const pieceId = active.id as string;
    const slotId = over.id as string;

    if (!slotId.startsWith('slot-')) return;

    const slotIndex = parseInt(slotId.split('-')[1]);
    const pieceIndex = parseInt(pieceId.split('-')[1]);

    if (slotIndex === pieceIndex) {
      const newSlots = slots.map(s => 
        s.id === slotId ? { ...s, pieceId } : s
      );
      setSlots(newSlots);

      const newPieces = pieces.map(p =>
        p.id === pieceId ? { ...p, placed: true } : p
      );
      setPieces(newPieces);

      checkCompletion(newSlots);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
    setupRound();
  };

  return (
    <Layout>
      <GameShell
        title="拼圖挑戰"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="puzzle"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-yellow))] text-[hsl(var(--macaron-yellow-dark))]"
      >
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
              把拼圖放到正確的位置！
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="grid grid-cols-2 gap-2 p-4 bg-white/50 rounded-2xl">
                {slots.map((slot) => (
                  <DroppableSlot 
                    key={slot.id} 
                    id={slot.id}
                    slotIndex={slot.slotIndex}
                    isCorrect={slot.pieceId !== null && parseInt(slot.pieceId.split('-')[1]) === slot.slotIndex}
                  >
                    {slot.pieceId && (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-4xl">{currentPuzzle.emoji}</span>
                        <span className="text-lg font-bold">{PIECE_LABELS[slot.slotIndex]}</span>
                      </div>
                    )}
                  </DroppableSlot>
                ))}
              </div>

              <div className="text-4xl md:text-6xl font-bold text-white/50">
                =
              </div>

              <div className="text-[5rem] md:text-[7rem] bg-white/30 p-4 rounded-2xl">
                {currentPuzzle.emoji}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap justify-center p-4 bg-white/30 rounded-2xl min-h-[100px]">
              {pieces.filter(p => !p.placed).map((piece) => (
                <DraggablePiece
                  key={piece.id}
                  id={piece.id}
                  pieceIndex={piece.pieceIndex}
                  emoji={currentPuzzle.emoji}
                />
              ))}
              {pieces.every(p => p.placed) && (
                <div className="flex items-center text-green-600 font-bold">
                  完成！
                </div>
              )}
            </div>

            <p className="text-sm md:text-base text-center opacity-70">
              把編號 ①②③④ 的拼圖拖到上方對應的位置
            </p>
          </div>
        </DndContext>
      </GameShell>
    </Layout>
  );
}
