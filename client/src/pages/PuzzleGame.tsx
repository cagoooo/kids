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

function DraggablePiece({ id, position, emoji }: { id: string; position: number; emoji: string }) {
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
      className={`w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center text-4xl md:text-5xl cursor-grab active:cursor-grabbing border-2 border-gray-200 ${isDragging ? 'opacity-80' : ''}`}
      whileHover={{ scale: 1.05 }}
      data-testid={`puzzle-piece-${position}`}
    >
      {emoji}
    </motion.div>
  );
}

function DroppableSlot({ id, children, isCorrect }: { id: string; children?: React.ReactNode; isCorrect?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
        isOver ? 'border-green-400 bg-green-50' : 
        isCorrect ? 'border-green-400 bg-green-100' : 'border-gray-300 bg-gray-50'
      }`}
      data-testid={`puzzle-slot-${id}`}
    >
      {children}
    </div>
  );
}

export default function PuzzleGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
  const [pieces, setPieces] = useState<{ id: string; placed: boolean; slot: string | null }[]>([]);
  const [slots, setSlots] = useState<{ id: string; pieceId: string | null }[]>([]);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const puzzle = PUZZLES[questionIndex % PUZZLES.length];
    setCurrentPuzzle(puzzle);

    const initialPieces = [
      { id: 'piece-0', placed: false, slot: null },
      { id: 'piece-1', placed: false, slot: null },
      { id: 'piece-2', placed: false, slot: null },
      { id: 'piece-3', placed: false, slot: null },
    ];

    const shuffled = [...initialPieces].sort(() => 0.5 - Math.random());
    setPieces(shuffled);

    setSlots([
      { id: 'slot-0', pieceId: null },
      { id: 'slot-1', pieceId: null },
      { id: 'slot-2', pieceId: null },
      { id: 'slot-3', pieceId: null },
    ]);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const checkCompletion = (newSlots: typeof slots) => {
    const allFilled = newSlots.every((slot, idx) => slot.pieceId === `piece-${idx}`);
    if (allFilled) {
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
        p.id === pieceId ? { ...p, placed: true, slot: slotId } : p
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

  const quadrants = [
    { transform: 'rotate(0deg)', position: 'top-left' },
    { transform: 'rotate(90deg)', position: 'top-right' },
    { transform: 'rotate(180deg)', position: 'bottom-left' },
    { transform: 'rotate(270deg)', position: 'bottom-right' },
  ];

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

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="grid grid-cols-2 gap-2 p-4 bg-white/50 rounded-2xl">
                {slots.map((slot, idx) => (
                  <DroppableSlot 
                    key={slot.id} 
                    id={slot.id}
                    isCorrect={slot.pieceId === `piece-${idx}`}
                  >
                    {slot.pieceId && (
                      <div 
                        className="text-4xl md:text-5xl"
                        style={{ transform: quadrants[idx].transform }}
                      >
                        {currentPuzzle.emoji}
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

            <div className="flex gap-3 flex-wrap justify-center p-4 bg-white/30 rounded-2xl">
              {pieces.filter(p => !p.placed).map((piece, idx) => (
                <DraggablePiece
                  key={piece.id}
                  id={piece.id}
                  position={parseInt(piece.id.split('-')[1])}
                  emoji={currentPuzzle.emoji}
                />
              ))}
            </div>

            <p className="text-sm md:text-base text-center opacity-70">
              提示：把每塊拼圖拖到上方對應的位置
            </p>
          </div>
        </DndContext>
      </GameShell>
    </Layout>
  );
}
