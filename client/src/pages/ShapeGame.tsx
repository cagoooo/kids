import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useTTS } from "@/hooks/use-tts";

const SHAPES = [
  { id: "circle", name: "圓形", color: "hsl(var(--macaron-pink))" },
  { id: "square", name: "正方形", color: "hsl(var(--macaron-blue))" },
  { id: "triangle", name: "三角形", color: "hsl(var(--macaron-green))" },
  { id: "star", name: "星形", color: "hsl(var(--macaron-yellow))" },
];

function ShapeIcon({ shape, size = 60, filled = true }: { shape: string; size?: number; filled?: boolean }) {
  const style = { width: size, height: size };
  
  switch (shape) {
    case "circle":
      return <div style={style} className={`rounded-full ${filled ? 'bg-[hsl(var(--macaron-pink))]' : 'border-4 border-dashed border-[hsl(var(--macaron-pink-dark))]'}`} />;
    case "square":
      return <div style={style} className={`rounded-lg ${filled ? 'bg-[hsl(var(--macaron-blue))]' : 'border-4 border-dashed border-[hsl(var(--macaron-blue-dark))]'}`} />;
    case "triangle":
      return (
        <div style={{ width: size, height: size * 0.866 }} className="relative">
          <div 
            className={filled ? '' : 'opacity-50'}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size * 0.866}px solid ${filled ? 'hsl(var(--macaron-green))' : 'hsl(var(--macaron-green-dark))'}`,
            }}
          />
        </div>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "hsl(var(--macaron-yellow))" : "none"} stroke={filled ? "none" : "hsl(var(--macaron-yellow-dark))"} strokeWidth="2" strokeDasharray={filled ? "0" : "4"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return null;
  }
}

function DraggableShape({ id, shape }: { id: string; shape: typeof SHAPES[0] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const { speak } = useTTS();

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-grab active:cursor-grabbing p-2 bg-white/50 rounded-2xl shadow-lg"
      onMouseEnter={() => speak(shape.name)}
      data-testid={`draggable-${id}`}
    >
      <ShapeIcon shape={id} size={70} />
    </motion.div>
  );
}

function DroppableSlot({ id, isCorrect, hasShape }: { id: string; isCorrect: boolean | null; hasShape: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-24 h-24 rounded-2xl flex items-center justify-center transition-all
        ${isOver ? 'scale-110 bg-white/60' : 'bg-white/30'}
        ${isCorrect === true ? 'ring-4 ring-green-400 bg-green-100' : ''}
        ${isCorrect === false ? 'ring-4 ring-red-400 animate-shake' : ''}
      `}
      data-testid={`droppable-${id}`}
    >
      {!hasShape && <ShapeIcon shape={id} size={60} filled={false} />}
      {hasShape && <ShapeIcon shape={id} size={60} filled={true} />}
    </div>
  );
}

export default function ShapeGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetSlots, setTargetSlots] = useState<string[]>([]);
  const [availableShapes, setAvailableShapes] = useState<string[]>([]);
  const [filledSlots, setFilledSlots] = useState<Record<string, boolean>>({});
  const [slotResults, setSlotResults] = useState<Record<string, boolean | null>>({});
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const shuffled = [...SHAPES].sort(() => 0.5 - Math.random());
    const roundSlots = shuffled.slice(0, 3).map(s => s.id);
    const roundShapes = [...roundSlots].sort(() => 0.5 - Math.random());
    
    setTargetSlots(roundSlots);
    setAvailableShapes(roundShapes);
    setFilledSlots({});
    setSlotResults({});
    
    speak("把餅乾放到正確的位置吧！");
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedShape = active.id as string;
    const targetSlot = over.id as string;

    if (draggedShape === targetSlot) {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
      speak("太棒了！");
      
      setFilledSlots(prev => ({ ...prev, [targetSlot]: true }));
      setSlotResults(prev => ({ ...prev, [targetSlot]: true }));
      setAvailableShapes(prev => prev.filter(s => s !== draggedShape));
      setScore(s => s + 10);

      const newFilled = { ...filledSlots, [targetSlot]: true };
      if (Object.keys(newFilled).length === targetSlots.length) {
        setTimeout(() => setQuestionIndex(i => i + 1), 800);
      }
    } else {
      speak("再試試看！");
      setSlotResults(prev => ({ ...prev, [targetSlot]: false }));
      setTimeout(() => setSlotResults(prev => ({ ...prev, [targetSlot]: null })), 500);
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
        title="形狀餅乾店"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="shape"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-yellow))] text-[hsl(var(--macaron-yellow-dark))]"
      >
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col items-center gap-8">
            <h3 className="font-display text-2xl font-bold text-center">
              把餅乾放到正確的烤盤裡！
            </h3>

            {/* Baking Tray (Drop Zones) */}
            <div className="bg-amber-100 p-6 rounded-[2rem] shadow-inner border-4 border-amber-200">
              <div className="flex gap-4">
                {targetSlots.map((slot) => (
                  <DroppableSlot 
                    key={slot} 
                    id={slot} 
                    isCorrect={slotResults[slot]} 
                    hasShape={filledSlots[slot] || false}
                  />
                ))}
              </div>
            </div>

            {/* Available Shapes */}
            <div className="flex gap-4 mt-4">
              {availableShapes.map((shapeId) => {
                const shape = SHAPES.find(s => s.id === shapeId)!;
                return <DraggableShape key={shapeId} id={shapeId} shape={shape} />;
              })}
            </div>
          </div>
        </DndContext>
      </GameShell>
    </Layout>
  );
}
