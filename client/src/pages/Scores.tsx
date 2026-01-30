import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useScores } from "@/hooks/use-scores";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Calculator, BookOpen, Trophy, Shapes, Music, Clock, Languages, Heart, Crown, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type GameType = "color" | "math" | "english" | "shape" | "melody" | "clock" | "bopomofo" | "emotion";

export default function Scores() {
  const [activeTab, setActiveTab] = useState<GameType>("color");
  const { data: scores, isLoading } = useScores(activeTab);

  const tabs = [
    { id: "color" as GameType, label: "顏色", icon: Palette, color: "text-pink-600", bg: "bg-pink-100", border: "border-pink-200", shadow: "shadow-pink-100" },
    { id: "math" as GameType, label: "數學", icon: Calculator, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200", shadow: "shadow-blue-100" },
    { id: "english" as GameType, label: "英文", icon: BookOpen, color: "text-green-600", bg: "bg-green-100", border: "border-green-200", shadow: "shadow-green-100" },
    { id: "shape" as GameType, label: "形狀", icon: Shapes, color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200", shadow: "shadow-yellow-100" },
    { id: "melody" as GameType, label: "音樂", icon: Music, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200", shadow: "shadow-purple-100" },
    { id: "clock" as GameType, label: "時鐘", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-100", border: "border-indigo-200", shadow: "shadow-indigo-100" },
    { id: "bopomofo" as GameType, label: "注音", icon: Languages, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200", shadow: "shadow-orange-100" },
    { id: "emotion" as GameType, label: "情緒", icon: Heart, color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200", shadow: "shadow-rose-100" },
  ];

  const activeTabColor = tabs.find(t => t.id === activeTab)?.bg || "bg-white";

  return (
    <Layout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center relative py-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl -z-10" />
          <h1 className="font-display text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 drop-shadow-sm flex items-center justify-center gap-3">
            <Trophy className="text-yellow-400 fill-yellow-300 w-12 h-12 md:w-16 md:h-16 animate-bounce" />
            榮譽榜
            <Trophy className="text-yellow-400 fill-yellow-300 w-12 h-12 md:w-16 md:h-16 animate-bounce delay-100" />
          </h1>
          <p className="text-gray-500 font-bold mt-2 text-lg">✨ 為最棒的小勇士們鼓掌！ ✨</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap bg-white/50 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border border-white/50">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm md:text-base transition-all
                ${activeTab === tab.id
                  ? `${tab.bg} ${tab.color} ring-4 ring-white shadow-lg scale-105`
                  : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 shadow-sm'}
              `}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-3xl bg-white/50" />
                  ))}
                </div>
              ) : scores && scores.length > 0 ? (
                <div className="space-y-8">
                  {/* Top 3 Podium */}
                  <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 pb-8 border-b-4 border-dashed border-gray-200">
                    {/* 2nd Place */}
                    {scores[1] && (
                      <div className="order-2 md:order-1 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center mb-2 relative">
                          <span className="text-3xl font-black text-gray-400">2</span>
                          <Medal className="w-8 h-8 text-gray-400 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm" />
                        </div>
                        <div className="bg-gray-100 rounded-t-2xl w-24 md:w-32 h-24 md:h-32 flex flex-col items-center justify-center shadow-inner border-t-4 border-white">
                          <span className="font-black text-gray-600 truncate max-w-full px-2">{scores[1].playerName}</span>
                          <span className="font-bold text-gray-400">{scores[1].score} 分</span>
                        </div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {scores[0] && (
                      <div className="order-1 md:order-2 flex flex-col items-center z-10 -mt-8 md:-mt-0">
                        <Crown className="w-12 h-12 text-yellow-400 fill-yellow-200 animate-bounce mb-2" />
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 border-4 border-white shadow-xl flex items-center justify-center mb-2 relative ring-4 ring-yellow-100">
                          <span className="text-4xl font-black text-yellow-700">1</span>
                        </div>
                        <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-2xl w-28 md:w-40 h-32 md:h-48 flex flex-col items-center justify-center shadow-lg border-t-4 border-yellow-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/20 skew-y-12 transform origin-bottom-left" />
                          <span className="font-black text-yellow-900 text-xl md:text-2xl truncate max-w-full px-2 relative z-10">{scores[0].playerName}</span>
                          <span className="font-bold text-yellow-800 text-lg relative z-10">{scores[0].score} 分</span>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {scores[2] && (
                      <div className="order-3 md:order-3 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-orange-200 border-4 border-white shadow-lg flex items-center justify-center mb-2 relative">
                          <span className="text-3xl font-black text-orange-600">3</span>
                          <Medal className="w-8 h-8 text-orange-400 absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm" />
                        </div>
                        <div className="bg-orange-100 rounded-t-2xl w-24 md:w-32 h-20 md:h-24 flex flex-col items-center justify-center shadow-inner border-t-4 border-white">
                          <span className="font-black text-orange-800 truncate max-w-full px-2">{scores[2].playerName}</span>
                          <span className="font-bold text-orange-600">{scores[2].score} 分</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remaining List */}
                  <div className="space-y-3 bg-white/60 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] shadow-xl border-4 border-white">
                    {scores.slice(3).length > 0 ? (
                      scores.slice(3).map((score, index) => (
                        <motion.div
                          key={score.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center text-sm shadow-inner group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                              {index + 4}
                            </div>
                            <span className="font-bold text-gray-700">{score.playerName}</span>
                          </div>
                          <div className="font-black text-xl text-[hsl(var(--macaron-blue-dark))]">
                            {score.score} <span className="text-xs font-normal text-gray-400">分</span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-400 font-medium">
                        還沒有更多挑戰者，快來創造紀錄！
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center bg-white/80 rounded-[2rem] shadow-xl border-4 border-dashed border-gray-200">
                  <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
                    <Trophy className="w-16 h-16 text-gray-300" />
                    <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-700 mb-2">榮譽榜還空空的！</h3>
                  <p className="text-gray-500 font-medium">誰會是第一個登上王座的小勇士呢？</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
