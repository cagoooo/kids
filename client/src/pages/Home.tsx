import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { Palette, Calculator, BookOpen, Star } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8 py-4">
        {/* Welcome Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block relative">
            <h1 className="font-display text-5xl md:text-7xl font-black text-[hsl(var(--macaron-purple-dark))] drop-shadow-sm leading-tight">
              一起玩 <br className="md:hidden"/> 一起學！
            </h1>
            <Star className="absolute -top-6 -right-6 w-12 h-12 text-[hsl(var(--macaron-yellow))] fill-current animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground font-medium max-w-lg mx-auto">
            選擇一個遊戲開始你的冒險吧！收集分數成為小超人！
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <GameCard
            title="顏色魔法"
            description="你能配對美麗的顏色嗎？讓我們一起彩繪世界！"
            icon={Palette}
            color="pink"
            href="/game/color"
            delay={0.1}
          />
          
          <GameCard
            title="數學小天才"
            description="數蘋果、加星星，成為數字小英雄！"
            icon={Calculator}
            color="blue"
            href="/game/math"
            delay={0.2}
          />
          
          <GameCard
            title="單字探險家"
            description="把單字和圖案配對起來，學英文超有趣！"
            icon={BookOpen}
            color="green"
            href="/game/english"
            delay={0.3}
          />
        </div>
      </div>
    </Layout>
  );
}
