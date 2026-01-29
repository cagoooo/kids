import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SEQUENCES = [
  { 
    title: "種植物的順序",
    items: ["🌱", "🪴", "🌿", "🌻"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "一天的時間",
    items: ["🌅", "☀️", "🌆", "🌙"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "蛋變成雞",
    items: ["🥚", "🐣", "🐥", "🐔"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "毛毛蟲變蝴蝶",
    items: ["🐛", "🫛", "🦋"],
    correct: [0, 1, 2]
  },
  { 
    title: "月亮的變化",
    items: ["🌑", "🌓", "🌕", "🌗"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "做蛋糕的順序",
    items: ["🥣", "🔥", "🎂", "🍰"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "季節的順序",
    items: ["🌸", "☀️", "🍂", "❄️"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "數字順序",
    items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "洗手步驟",
    items: ["💧", "🧼", "👐", "🧻"],
    correct: [0, 1, 2, 3]
  },
  { 
    title: "起床順序",
    items: ["🛏️", "🚿", "👔", "🍳"],
    correct: [0, 1, 2, 3]
  },
];

function SortableItem({ id, emoji, index }: { id: string; emoji: string; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl sm:text-4xl md:text-5xl cursor-grab active:cursor-grabbing border-2 border-gray-200 ${isDragging ? 'opacity-70 shadow-2xl' : ''}`}
      whileHover={{ scale: 1.05 }}
      data-testid={`sequence-item-${index}`}
    >
      {emoji}
    </motion.div>
  );
}

export default function SequenceGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(SEQUENCES[0]);
  const [items, setItems] = useState<{ id: string; emoji: string; originalIndex: number }[]>([]);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const seq = SEQUENCES[questionIndex % SEQUENCES.length];
    setCurrentSequence(seq);

    const shuffled = seq.items.map((emoji, idx) => ({
      id: `item-${idx}`,
      emoji,
      originalIndex: idx
    })).sort(() => 0.5 - Math.random());

    setItems(shuffled);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const checkOrder = (newItems: typeof items) => {
    const isCorrect = newItems.every((item, idx) => item.originalIndex === idx);
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6BCB77', '#FFD93D', '#4D96FF']
      });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 800);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    checkOrder(newItems);
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
        title="順序排列"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="sequence"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center">
            {currentSequence.title}
          </h3>

          <p className="text-base md:text-lg text-center opacity-80">
            把圖片按正確的順序排好
          </p>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-2 sm:gap-3 md:gap-4 p-4 bg-white/30 rounded-2xl flex-wrap justify-center">
                {items.map((item, idx) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    emoji={item.emoji}
                    index={idx}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex items-center gap-2 text-lg md:text-xl opacity-70">
            <span>先</span>
            <span className="text-2xl">➡️</span>
            <span>後</span>
          </div>

          <p className="text-sm md:text-base text-center opacity-60">
            拖動圖片來調整順序
          </p>
        </div>
      </GameShell>
    </Layout>
  );
}
