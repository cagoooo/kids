import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { Palette, Calculator, BookOpen, Shapes, Music, Clock, Languages, Heart, Star, Code, Flower2, ShoppingCart, Recycle, Brain } from "lucide-react";

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
          </p>
        </div>

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
        </div>
      </div>
    </Layout>
  );
}
