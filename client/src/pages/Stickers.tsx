import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Star, Lock } from "lucide-react";

const STICKERS = [
  { id: 1, emoji: "🦄", name: "獨角獸", rarity: "稀有" },
  { id: 2, emoji: "🐱", name: "小貓咪", rarity: "普通" },
  { id: 3, emoji: "🐶", name: "小狗狗", rarity: "普通" },
  { id: 4, emoji: "🐰", name: "小兔子", rarity: "普通" },
  { id: 5, emoji: "🦋", name: "蝴蝶", rarity: "稀有" },
  { id: 6, emoji: "🌈", name: "彩虹", rarity: "稀有" },
  { id: 7, emoji: "⭐", name: "星星", rarity: "普通" },
  { id: 8, emoji: "🌸", name: "櫻花", rarity: "普通" },
  { id: 9, emoji: "🍰", name: "蛋糕", rarity: "普通" },
  { id: 10, emoji: "🍭", name: "棒棒糖", rarity: "普通" },
  { id: 11, emoji: "🎀", name: "蝴蝶結", rarity: "普通" },
  { id: 12, emoji: "🎈", name: "氣球", rarity: "普通" },
  { id: 13, emoji: "🦊", name: "小狐狸", rarity: "稀有" },
  { id: 14, emoji: "🐼", name: "熊貓", rarity: "稀有" },
  { id: 15, emoji: "🦁", name: "獅子", rarity: "稀有" },
  { id: 16, emoji: "🐧", name: "企鵝", rarity: "普通" },
  { id: 17, emoji: "🦀", name: "螃蟹", rarity: "普通" },
  { id: 18, emoji: "🐳", name: "鯨魚", rarity: "稀有" },
  { id: 19, emoji: "🌟", name: "閃亮星", rarity: "傳說" },
  { id: 20, emoji: "👑", name: "皇冠", rarity: "傳說" },
];

const STICKER_STORAGE_KEY = "kidszone_stickers";

export default function Stickers() {
  const [collectedStickers, setCollectedStickers] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STICKER_STORAGE_KEY);
    if (saved) {
      setCollectedStickers(JSON.parse(saved));
    }
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "傳說": return "from-yellow-300 to-orange-400";
      case "稀有": return "from-purple-300 to-pink-400";
      default: return "from-blue-200 to-green-200";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "傳說": return "border-yellow-400 ring-2 ring-yellow-300";
      case "稀有": return "border-purple-300";
      default: return "border-white";
    }
  };

  const collectedCount = collectedStickers.length;
  const totalCount = STICKERS.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--macaron-purple-dark))]">
            貼紙收集冊
          </h1>
          <p className="text-muted-foreground font-medium">
            玩遊戲收集可愛的馬卡龍貼紙！
          </p>
          
          {/* Progress */}
          <div className="bg-white/60 backdrop-blur-md rounded-full px-6 py-3 inline-flex items-center gap-3 shadow-md">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
            <span className="font-display font-bold text-xl">
              {collectedCount} / {totalCount}
            </span>
            <span className="text-muted-foreground">已收集</span>
          </div>
        </div>

        {/* Sticker Grid */}
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-xl border-4 border-white">
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {STICKERS.map((sticker, index) => {
              const isCollected = collectedStickers.includes(sticker.id);
              
              return (
                <motion.div
                  key={sticker.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center gap-1
                    border-4 transition-all relative overflow-hidden
                    ${isCollected 
                      ? `bg-gradient-to-br ${getRarityColor(sticker.rarity)} ${getRarityBorder(sticker.rarity)} shadow-lg` 
                      : 'bg-gray-100 border-gray-200'}
                  `}
                  data-testid={`sticker-${sticker.id}`}
                >
                  {isCollected ? (
                    <>
                      <span className="text-4xl md:text-5xl">{sticker.emoji}</span>
                      <span className="text-xs font-bold text-white/80 hidden md:block">
                        {sticker.name}
                      </span>
                      {sticker.rarity === "傳說" && (
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent pointer-events-none animate-pulse" />
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <Lock className="w-8 h-8" />
                      <span className="text-xs mt-1">???</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-200 to-green-200" />
            <span className="text-sm font-medium">普通</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-300 to-pink-400" />
            <span className="text-sm font-medium">稀有</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400" />
            <span className="text-sm font-medium">傳說</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
