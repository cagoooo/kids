import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useScores } from "@/hooks/use-scores";
import { motion } from "framer-motion";
import { Palette, Calculator, BookOpen, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Scores() {
  const [activeTab, setActiveTab] = useState<"color" | "math" | "english">("color");
  const { data: scores, isLoading } = useScores(activeTab);

  const tabs = [
    { id: "color", label: "顏色", icon: Palette, color: "text-[hsl(var(--macaron-pink-dark))]", bg: "bg-[hsl(var(--macaron-pink))]" },
    { id: "math", label: "數學", icon: Calculator, color: "text-[hsl(var(--macaron-blue-dark))]", bg: "bg-[hsl(var(--macaron-blue))]" },
    { id: "english", label: "英文", icon: BookOpen, color: "text-[hsl(var(--macaron-green-dark))]", bg: "bg-[hsl(var(--macaron-green))]" },
  ] as const;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[hsl(var(--macaron-purple-dark))]">
            榮譽榜
          </h1>
          <p className="text-muted-foreground font-medium">最厲害的小朋友都在這裡！</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all shadow-sm
                ${activeTab === tab.id 
                  ? `${tab.bg} ${tab.color} shadow-md scale-105` 
                  : 'bg-white text-gray-500 hover:bg-gray-50'}
              `}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Score List */}
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-xl border-4 border-white min-h-[400px]">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl bg-white/50" />
              ))}
            </div>
          ) : scores && scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl border-2
                    ${index === 0 ? 'bg-yellow-100 border-yellow-200 shadow-md' : 'bg-white border-transparent hover:border-gray-100'}
                  `}
                  data-testid={`score-row-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-black text-lg
                      ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-200 text-orange-800' : 'bg-gray-100 text-gray-500'}
                    `}>
                      {index + 1}
                    </div>
                    <span className="font-display font-bold text-xl text-foreground">
                      {score.playerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-2xl text-[hsl(var(--macaron-purple-dark))]">
                    {score.score} <span className="text-sm opacity-50 font-normal self-end mb-1">分</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
              <Trophy className="w-16 h-16 mb-4 text-gray-300" />
              <p className="font-display text-xl">還沒有分數喔！</p>
              <p className="text-sm">快來成為第一個挑戰者吧！</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
