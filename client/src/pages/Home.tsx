import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { ProfileCard } from "@/components/ProfileCard";
import { Palette, Calculator, BookOpen, Shapes, Music, Clock, Languages, Heart, Star, Code, Flower2, ShoppingCart, Recycle, Brain, Cat, Car, User, Apple, Briefcase, Puzzle, Search, ListOrdered, FolderOpen } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8 py-4">
        {/* Welcome Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-block relative">
            <h1 className="font-display text-4xl md:text-6xl font-black text-[hsl(var(--macaron-purple-dark))] drop-shadow-sm leading-tight">
              一起玩 一起學！
            </h1>
            <Star className="absolute -top-4 -right-4 w-10 h-10 text-[hsl(var(--macaron-yellow))] fill-current animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto">
            選擇一個遊戲開始你的冒險吧！收集分數和貼紙成為小超人！
            import {Calendar, Sparkles} from "lucide-react";
            import {Link} from "wouter";

            // ...

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
            </div>
        </div>
    </Layout>
  );
}
