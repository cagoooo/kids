import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";

const SORTING_SETS = [
  {
    title: "食物 vs 玩具",
    categories: [
      { id: "food", name: "食物", emoji: "🍽️" },
      { id: "toy", name: "玩具", emoji: "🧸" }
    ],
    items: [
      { id: "apple", emoji: "🍎", category: "food" },
      { id: "ball", emoji: "⚽", category: "toy" },
      { id: "banana", emoji: "🍌", category: "food" },
      { id: "car", emoji: "🚗", category: "toy" },
    ]
  },
  {
    title: "天上 vs 地上",
    categories: [
      { id: "sky", name: "天上", emoji: "☁️" },
      { id: "ground", name: "地上", emoji: "🏔️" }
    ],
    items: [
      { id: "bird", emoji: "🐦", category: "sky" },
      { id: "dog", emoji: "🐕", category: "ground" },
      { id: "plane", emoji: "✈️", category: "sky" },
      { id: "car", emoji: "🚗", category: "ground" },
    ]
  },
  {
    title: "水果 vs 蔬菜",
    categories: [
      { id: "fruit", name: "水果", emoji: "🍎" },
      { id: "vegetable", name: "蔬菜", emoji: "🥕" }
    ],
    items: [
      { id: "grape", emoji: "🍇", category: "fruit" },
      { id: "carrot", emoji: "🥕", category: "vegetable" },
      { id: "orange", emoji: "🍊", category: "fruit" },
      { id: "broccoli", emoji: "🥦", category: "vegetable" },
    ]
  },
  {
    title: "大 vs 小",
    categories: [
      { id: "big", name: "大", emoji: "🐘" },
      { id: "small", name: "小", emoji: "🐁" }
    ],
    items: [
      { id: "elephant", emoji: "🐘", category: "big" },
      { id: "ant", emoji: "🐜", category: "small" },
      { id: "whale", emoji: "🐋", category: "big" },
      { id: "mouse", emoji: "🐭", category: "small" },
    ]
  },
  {
    title: "冷 vs 熱",
    categories: [
      { id: "cold", name: "冷", emoji: "❄️" },
      { id: "hot", name: "熱", emoji: "🔥" }
    ],
    items: [
      { id: "ice", emoji: "🧊", category: "cold" },
      { id: "sun", emoji: "☀️", category: "hot" },
      { id: "snow", emoji: "⛄", category: "cold" },
      { id: "fire", emoji: "🔥", category: "hot" },
    ]
  },
  {
    title: "動物 vs 植物",
    categories: [
      { id: "animal", name: "動物", emoji: "🐾" },
      { id: "plant", name: "植物", emoji: "🌿" }
    ],
    items: [
      { id: "cat", emoji: "🐱", category: "animal" },
      { id: "tree", emoji: "🌳", category: "plant" },
      { id: "fish", emoji: "🐟", category: "animal" },
      { id: "flower", emoji: "🌸", category: "plant" },
    ]
  },
  {
    title: "衣服 vs 鞋子",
    categories: [
      { id: "clothes", name: "衣服", emoji: "👕" },
      { id: "shoes", name: "鞋子", emoji: "👟" }
    ],
    items: [
      { id: "shirt", emoji: "👕", category: "clothes" },
      { id: "sneaker", emoji: "👟", category: "shoes" },
      { id: "dress", emoji: "👗", category: "clothes" },
      { id: "boot", emoji: "🥾", category: "shoes" },
    ]
  },
  {
    title: "白天 vs 晚上",
    categories: [
      { id: "day", name: "白天", emoji: "☀️" },
      { id: "night", name: "晚上", emoji: "🌙" }
    ],
    items: [
      { id: "sun", emoji: "🌞", category: "day" },
      { id: "moon", emoji: "🌛", category: "night" },
      { id: "cloud", emoji: "⛅", category: "day" },
      { id: "star", emoji: "⭐", category: "night" },
    ]
  },
  {
    title: "圓形 vs 方形",
    categories: [
      { id: "round", name: "圓形", emoji: "⭕" },
      { id: "square", name: "方形", emoji: "⬜" }
    ],
    items: [
      { id: "ball", emoji: "🔴", category: "round" },
      { id: "box", emoji: "📦", category: "square" },
      { id: "cookie", emoji: "🍪", category: "round" },
      { id: "book", emoji: "📕", category: "square" },
    ]
  },
  {
    title: "海洋 vs 陸地",
    categories: [
      { id: "sea", name: "海洋", emoji: "🌊" },
      { id: "land", name: "陸地", emoji: "🏔️" }
    ],
    items: [
      { id: "fish", emoji: "🐠", category: "sea" },
      { id: "lion", emoji: "🦁", category: "land" },
      { id: "octopus", emoji: "🐙", category: "sea" },
      { id: "rabbit", emoji: "🐰", category: "land" },
    ]
  },
];

function DraggableItem({ id, emoji, placed }: { id: string; emoji: string; placed: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: placed,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 1,
  } : undefined;

  if (placed) return null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl sm:text-4xl md:text-5xl cursor-grab active:cursor-grabbing border-2 border-gray-200 ${isDragging ? 'opacity-70' : ''}`}
      whileHover={{ scale: 1.1 }}
      data-testid={`sorting-item-${id}`}
    >
      {emoji}
    </motion.div>
  );
}

function CategoryDropzone({ id, name, emoji, items, isOver }: { 
  id: string; 
  name: string; 
  emoji: string; 
  items: { id: string; emoji: string }[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[120px] md:min-h-[150px] p-3 md:p-4 rounded-2xl border-2 border-dashed transition-colors ${
        isOver ? 'border-green-400 bg-green-50' : 'border-white/50 bg-white/20'
      }`}
      data-testid={`sorting-category-${id}`}
    >
      <div className="text-center mb-2">
        <span className="text-3xl md:text-4xl">{emoji}</span>
        <div className="font-bold text-sm md:text-base">{name}</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {items.map(item => (
          <div key={item.id} className="text-2xl md:text-3xl bg-white/50 p-2 rounded-lg">
            {item.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SortingGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentSet, setCurrentSet] = useState(SORTING_SETS[0]);
  const [items, setItems] = useState<{ id: string; emoji: string; category: string; placed: boolean }[]>([]);
  const [sortedItems, setSortedItems] = useState<{ [key: string]: { id: string; emoji: string }[] }>({});
  const [activeOver, setActiveOver] = useState<string | null>(null);

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const set = SORTING_SETS[questionIndex % SORTING_SETS.length];
    setCurrentSet(set);
    setItems(set.items.map(i => ({ ...i, placed: false })).sort(() => 0.5 - Math.random()));
    setSortedItems({});
    setActiveOver(null);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const checkCompletion = (newItems: typeof items, newSorted: typeof sortedItems) => {
    const allPlaced = newItems.every(i => i.placed);
    if (allPlaced) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#9D4EDD', '#4D96FF', '#FFD93D']
      });
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 800);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveOver(null);
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;
    const categoryId = over.id as string;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.category === categoryId) {
      const newItems = items.map(i => 
        i.id === itemId ? { ...i, placed: true } : i
      );
      setItems(newItems);

      const newSorted = { ...sortedItems };
      if (!newSorted[categoryId]) newSorted[categoryId] = [];
      newSorted[categoryId].push({ id: item.id, emoji: item.emoji });
      setSortedItems(newSorted);

      checkCompletion(newItems, newSorted);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleDragOver = (event: any) => {
    setActiveOver(event.over?.id || null);
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
        title="分類小幫手"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="sorting"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
      >
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <motion.h3 
              animate={{ rotate: shake ? [-3, 3, -3, 3, 0] : 0 }}
              className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center"
            >
              {currentSet.title}
            </motion.h3>

            <div className="flex gap-3 md:gap-4 w-full max-w-lg">
              {currentSet.categories.map(cat => (
                <CategoryDropzone
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  emoji={cat.emoji}
                  items={sortedItems[cat.id] || []}
                  isOver={activeOver === cat.id}
                />
              ))}
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center p-4 bg-white/30 rounded-2xl min-h-[80px]">
              {items.filter(i => !i.placed).map(item => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  emoji={item.emoji}
                  placed={item.placed}
                />
              ))}
              {items.every(i => i.placed) && (
                <div className="text-green-600 font-bold flex items-center gap-2">
                  ✓ 全部分類完成！
                </div>
              )}
            </div>

            <p className="text-sm md:text-base text-center opacity-70">
              把東西拖到正確的分類
            </p>
          </div>
        </DndContext>
      </GameShell>
    </Layout>
  );
}
