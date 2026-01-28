import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";

interface TrashItem {
  id: string;
  name: string;
  emoji: string;
  type: "general" | "paper" | "plastic";
}

const TRASH_ITEMS: TrashItem[] = [
  { id: "fishbone", name: "魚骨頭", emoji: "🐟", type: "general" },
  { id: "banana", name: "香蕉皮", emoji: "🍌", type: "general" },
  { id: "eggshell", name: "蛋殼", emoji: "🥚", type: "general" },
  { id: "newspaper", name: "舊報紙", emoji: "📰", type: "paper" },
  { id: "cardboard", name: "紙箱", emoji: "📦", type: "paper" },
  { id: "paper", name: "廢紙", emoji: "📄", type: "paper" },
  { id: "bottle", name: "寶特瓶", emoji: "🍶", type: "plastic" },
  { id: "bag", name: "塑膠袋", emoji: "🛍️", type: "plastic" },
  { id: "cup", name: "塑膠杯", emoji: "🥤", type: "plastic" },
];

const BINS = [
  { id: "general", name: "一般垃圾", emoji: "🗑️", color: "bg-gray-400", happyEmoji: "😊" },
  { id: "paper", name: "紙類回收", emoji: "📄", color: "bg-blue-400", happyEmoji: "😄" },
  { id: "plastic", name: "塑膠回收", emoji: "♻️", color: "bg-green-400", happyEmoji: "😁" },
];

function DraggableTrash({ item, onSpeak }: { item: TrashItem; onSpeak: (text: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: isDragging ? 100 : 1,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg cursor-grab active:cursor-grabbing flex flex-col items-center gap-1"
      onMouseEnter={() => onSpeak(item.name)}
      data-testid={`trash-${item.id}`}
    >
      <span className="text-3xl sm:text-4xl">{item.emoji}</span>
      <span className="text-xs sm:text-sm font-medium">{item.name}</span>
    </motion.div>
  );
}

function RecycleBin({ bin, isHappy, isWrong }: { bin: typeof BINS[0]; isHappy: boolean; isWrong: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: bin.id });

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        scale: isOver ? 1.1 : 1,
        rotate: isWrong ? [-5, 5, -5, 5, 0] : 0,
      }}
      className={`
        ${bin.color} w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-xl sm:rounded-2xl 
        flex flex-col items-center justify-center gap-1 shadow-lg
        border-4 ${isOver ? 'border-white' : 'border-white/50'}
        ${isHappy ? 'ring-4 ring-green-400' : ''}
        ${isWrong ? 'ring-4 ring-red-400' : ''}
      `}
      data-testid={`bin-${bin.id}`}
    >
      <motion.span 
        className="text-3xl sm:text-4xl"
        animate={{ scale: isHappy ? [1, 1.3, 1] : 1 }}
      >
        {isHappy ? bin.happyEmoji : bin.emoji}
      </motion.span>
      <span className="text-xs sm:text-sm font-bold text-white text-center px-1">
        {bin.name}
      </span>
    </motion.div>
  );
}

export default function RecycleGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState<TrashItem | null>(null);
  const [happyBin, setHappyBin] = useState<string | null>(null);
  const [wrongBin, setWrongBin] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [itemsQueue, setItemsQueue] = useState<TrashItem[]>([]);
  const { speak } = useTTS();

  useEffect(() => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }
    
    if (itemsQueue.length === 0 || questionIndex === 0) {
      const shuffled = [...TRASH_ITEMS].sort(() => 0.5 - Math.random());
      setItemsQueue(shuffled);
      setCurrentItem(shuffled[0]);
    } else {
      setCurrentItem(itemsQueue[questionIndex % itemsQueue.length]);
    }
    
    setHappyBin(null);
    setWrongBin(null);
  }, [questionIndex]);

  useEffect(() => {
    if (currentItem) {
      speak(`這是${currentItem.name}，要丟到哪裡呢？`);
    }
  }, [currentItem]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !currentItem) return;

    const binId = over.id as string;
    
    if (binId === currentItem.type) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      speak("答對了！地球謝謝你！");
      setHappyBin(binId);
      setScore(s => s + 10);
      
      setTimeout(() => {
        setQuestionIndex(i => i + 1);
      }, 1000);
    } else {
      speak("不對喔，再想想看！");
      setWrongBin(binId);
      setTimeout(() => setWrongBin(null), 500);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
    setItemsQueue([]);
    setHappyBin(null);
    setWrongBin(null);
  };

  return (
    <Layout>
      <GameShell
        title="快樂回收站"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="recycle"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]"
      >
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-center px-2">
              把垃圾丟到正確的桶子裡！
            </h3>

            {/* Conveyor Belt with Trash */}
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="bg-gray-300 h-20 sm:h-24 rounded-xl flex items-center justify-center border-4 border-gray-400">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-gray-500 rounded-full mx-4" />
                <AnimatePresence mode="wait">
                  {currentItem && !happyBin && (
                    <DraggableTrash 
                      key={currentItem.id + questionIndex} 
                      item={currentItem} 
                      onSpeak={speak}
                    />
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute left-2 right-2 -bottom-2 flex justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-4 bg-gray-500 rounded-b-full" />
                ))}
              </div>
            </div>

            {/* Instruction */}
            <p className="text-sm sm:text-base text-center opacity-80">
              拖曳垃圾到正確的回收桶！
            </p>

            {/* Recycle Bins */}
            <div className="flex gap-2 sm:gap-4 md:gap-6">
              {BINS.map((bin) => (
                <RecycleBin 
                  key={bin.id} 
                  bin={bin} 
                  isHappy={happyBin === bin.id}
                  isWrong={wrongBin === bin.id}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="bg-white/40 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm">
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                <span>🗑️ 廚餘/一般</span>
                <span>📄 紙類</span>
                <span>♻️ 塑膠</span>
              </div>
            </div>
          </div>
        </DndContext>
      </GameShell>
    </Layout>
  );
}
