import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { ProfileCard } from "@/components/ProfileCard";
import { Palette, Calculator, BookOpen, Shapes, Music, Clock, Languages, Heart, Star, Code, Flower2, ShoppingCart, Recycle, Brain, Cat, Car, User, Apple, Briefcase, Puzzle, Search, ListOrdered, FolderOpen, Calendar, Sparkles, School, Gavel, Flame, CheckCircle2 } from "lucide-react";

import { useDailyStreak } from "@/hooks/use-daily-streak";
import { useSound } from "@/hooks/use-sound-context";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Home() {
  const { playHover, playClick, playCorrect } = useSound();
  const { streak, checkedInToday, handleCheckIn, showCelebration } = useDailyStreak();

  // Trigger confetti when celebration is shown
  useEffect(() => {
    if (showCelebration) {
      playCorrect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500'] // Fire colors
      });
    }
  }, [showCelebration]);

  return (
    <Layout>
      <div className="space-y-8 py-4">
        {/* Welcome Header */}
        <section className="text-center space-y-4 pt-4 md:pt-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm pb-2">
              歡迎來到童樂學園！
            </h1>
          </motion.div>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            這裡有好多好玩的遊戲，等你來挑戰喔！
          </p>

          {/* Daily Streak Widget */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={() => {
                if (!checkedInToday) {
                  handleCheckIn();
                  playClick();
                }
              }}
              disabled={checkedInToday && !showCelebration}
              className={`
                    group relative flex items-center gap-3 px-6 py-3 rounded-full border-4 transition-all duration-300
                    ${checkedInToday
                  ? 'bg-orange-50 border-orange-200 shadow-sm cursor-default'
                  : 'bg-white border-orange-400 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer'}
                `}
            >
              <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${checkedInToday ? 'bg-orange-100' : 'bg-orange-500 animate-pulse'}
                `}>
                <Flame className={`w-6 h-6 ${checkedInToday ? 'text-orange-400' : 'text-white fill-white'}`} />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">每日連續挑戰</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${checkedInToday ? 'text-orange-500' : 'text-gray-700'}`}>
                    {streak} <span className="text-sm font-bold">天</span>
                  </span>
                  {checkedInToday && !showCelebration && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {!checkedInToday && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full animate-bounce">
                      點我簽到！
                    </span>
                  )}
                </div>
              </div>

              {/* Celebration Message */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-black px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-20 border-2 border-white"
                  >
                    簽到成功！🔥
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </section>

        {/* Daily Challenge Banner */}
        <Link href={import.meta.env.BASE_URL.replace(/\/$/, "") + "/daily"}>
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1 shadow-lg mb-8 cursor-pointer transform hover:scale-[1.02] transition-transform">
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.3rem] p-4 flex items-center gap-4">
              <div className="bg-yellow-400 p-3 rounded-full text-white animate-bounce">
                <Sparkles className="w-8 h-8 fill-current" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                  每日挑戰
                </h3>
                <p className="text-sm font-bold text-gray-500">
                  完成今天的 5 個任務，獲得神秘獎勵！
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-xl">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>

        <ProfileCard />

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <GameCard
            title="顏色魔法"
            description="配對美麗的顏色"
            icon={Palette}
            color="pink"
            href="/game/color"
            delay={0.1}
          />

          <GameCard
            title="數學樂園"
            description="加減法小英雄"
            icon={Calculator}
            color="blue"
            href="/game/math"
            delay={0.15}
          />

          <GameCard
            title="單字探險"
            description="學習英文單字"
            icon={BookOpen}
            color="green"
            href="/game/english"
            delay={0.2}
          />

          <GameCard
            title="形狀餅乾店"
            description="拖曳形狀配對"
            icon={Shapes}
            color="yellow"
            href="/game/shape"
            delay={0.25}
          />

          <GameCard
            title="DoReMi 音樂會"
            description="跟著旋律彈奏"
            icon={Music}
            color="purple"
            href="/game/melody"
            delay={0.3}
          />

          <GameCard
            title="時鐘小管家"
            description="認識時間"
            icon={Clock}
            color="blue"
            href="/game/clock"
            delay={0.35}
          />

          <GameCard
            title="注音小火車"
            description="學習ㄅㄆㄇ"
            icon={Languages}
            color="green"
            href="/game/bopomofo"
            delay={0.4}
          />

          <GameCard
            title="心情氣象台"
            description="認識情緒感受"
            icon={Heart}
            color="purple"
            href="/game/emotion"
            delay={0.45}
          />

          <GameCard
            title="程式探險隊"
            description="邏輯思考遊戲"
            icon={Code}
            color="green"
            href="/game/coding"
            delay={0.5}
          />

          <GameCard
            title="神奇植物園"
            description="認識植物生長"
            icon={Flower2}
            color="pink"
            href="/game/garden"
            delay={0.55}
          />

          <GameCard
            title="超市小幫手"
            description="金錢與購物"
            icon={ShoppingCart}
            color="blue"
            href="/game/market"
            delay={0.6}
          />

          <GameCard
            title="快樂回收站"
            description="垃圾分類"
            icon={Recycle}
            color="green"
            href="/game/recycle"
            delay={0.65}
          />

          <GameCard
            title="魔法翻翻牌"
            description="記憶力挑戰"
            icon={Brain}
            color="purple"
            href="/game/memory"
            delay={0.7}
          />

          <GameCard
            title="動物王國"
            description="認識動物朋友"
            icon={Cat}
            color="yellow"
            href="/game/animal"
            delay={0.75}
          />

          <GameCard
            title="交通小達人"
            description="交通工具與規則"
            icon={Car}
            color="blue"
            href="/game/traffic"
            delay={0.8}
          />

          <GameCard
            title="我的身體"
            description="認識身體部位"
            icon={User}
            color="pink"
            href="/game/body"
            delay={0.85}
          />

          <GameCard
            title="蔬果大集合"
            description="認識水果蔬菜"
            icon={Apple}
            color="green"
            href="/game/food"
            delay={0.9}
          />

          <GameCard
            title="職業大冒險"
            description="認識各種職業"
            icon={Briefcase}
            color="purple"
            href="/game/job"
            delay={0.95}
          />

          <GameCard
            title="拼圖挑戰"
            description="拖拉完成拼圖"
            icon={Puzzle}
            color="yellow"
            href="/game/puzzle"
            delay={1.0}
          />

          <GameCard
            title="找找看"
            description="找出不一樣的"
            icon={Search}
            color="blue"
            href="/game/difference"
            delay={1.05}
          />

          <GameCard
            title="順序排列"
            description="排出正確順序"
            icon={ListOrdered}
            color="green"
            href="/game/sequence"
            delay={1.1}
          />

          <GameCard
            title="分類小幫手"
            description="把物品分類"
            icon={FolderOpen}
            color="purple"
            href="/game/sorting"
            delay={1.15}
          />



          <GameCard
            title="創意畫畫板"
            description="發揮創意畫一畫"
            icon={Palette}
            color="pink"
            href="/game/drawing"
            delay={1.25}
          />

          <GameCard
            title="打地鼠挑戰"
            description="反應力大考驗"
            icon={Gavel}
            color="yellow"
            href="/game/mole"
            delay={1.3}
          />
        </div>
      </div>
    </Layout>
  );
}
