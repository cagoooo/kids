import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, Star, Trophy, Medal, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTTS } from "@/hooks/use-tts";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  bgColor: string;
  requirement: { type: "score" | "stickers" | "games"; value: number };
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "math_master",
    title: "數學小達人",
    description: "在數學樂園獲得 100 分",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    requirement: { type: "score", value: 100 },
  },
  {
    id: "word_explorer",
    title: "單字探險家",
    description: "在單字探險獲得 100 分",
    icon: Medal,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    requirement: { type: "score", value: 100 },
  },
  {
    id: "sticker_collector",
    title: "貼紙收藏家",
    description: "收集 10 張貼紙",
    icon: Star,
    color: "text-pink-500",
    bgColor: "bg-pink-100",
    requirement: { type: "stickers", value: 10 },
  },
  {
    id: "super_kid",
    title: "小超人",
    description: "收集 20 張貼紙",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    requirement: { type: "stickers", value: 20 },
  },
];

const STICKER_STORAGE_KEY = "kidszone_stickers";
const ACHIEVEMENTS_STORAGE_KEY = "kidszone_achievements";

export default function Certificates() {
  const [playerName, setPlayerName] = useState("");
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { speak } = useTTS();

  const { data: scores } = useQuery<{ id: number; playerName: string; gameType: string; score: number }[]>({
    queryKey: ["/api/scores"],
  });

  useEffect(() => {
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
    
    checkAndUnlockAchievements();
  }, [scores]);

  const checkAndUnlockAchievements = () => {
    const savedStickers = localStorage.getItem(STICKER_STORAGE_KEY);
    const stickerCount = savedStickers ? JSON.parse(savedStickers).length : 0;
    
    const newUnlocked: string[] = [];
    
    ACHIEVEMENTS.forEach((achievement) => {
      if (achievement.requirement.type === "stickers") {
        if (stickerCount >= achievement.requirement.value) {
          newUnlocked.push(achievement.id);
        }
      } else if (achievement.requirement.type === "score" && scores) {
        const hasHighScore = scores.some(s => s.score >= achievement.requirement.value);
        if (hasHighScore) {
          newUnlocked.push(achievement.id);
        }
      }
    });

    if (newUnlocked.length > 0) {
      const currentUnlocked = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      const current = currentUnlocked ? JSON.parse(currentUnlocked) : [];
      const merged = [...new Set([...current, ...newUnlocked])];
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(merged));
      setUnlockedAchievements(merged);
    }
  };

  const handlePrintCertificate = () => {
    if (!selectedAchievement || !playerName.trim()) {
      speak("請先輸入你的名字！");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const Icon = selectedAchievement.icon;
    const today = new Date().toLocaleDateString("zh-TW");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>小超人證書 - ${playerName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Noto Sans TC', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
          }
          .certificate {
            width: 800px;
            height: 600px;
            background: linear-gradient(135deg, #fff9e6 0%, #fff 50%, #e6f3ff 100%);
            border: 8px solid #ffd700;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .corner { position: absolute; font-size: 40px; }
          .corner-tl { top: 20px; left: 20px; }
          .corner-tr { top: 20px; right: 20px; }
          .corner-bl { bottom: 20px; left: 20px; }
          .corner-br { bottom: 20px; right: 20px; }
          .header { font-size: 48px; color: #ff6b6b; margin-bottom: 20px; }
          .award-icon { font-size: 80px; margin: 20px 0; }
          .title { font-size: 36px; color: #4a4a4a; margin: 20px 0; }
          .name { font-size: 48px; color: #6b5ce7; font-weight: bold; margin: 30px 0; }
          .achievement { font-size: 24px; color: #666; margin: 20px 0; }
          .date { font-size: 18px; color: #888; margin-top: 40px; }
          .footer { font-size: 20px; color: #ff9f43; margin-top: 20px; }
          @media print {
            body { background: white; }
            .certificate { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <span class="corner corner-tl">⭐</span>
          <span class="corner corner-tr">⭐</span>
          <span class="corner corner-bl">⭐</span>
          <span class="corner corner-br">⭐</span>
          
          <div class="header">🎉 小超人證書 🎉</div>
          <div class="award-icon">🏆</div>
          <div class="title">恭喜獲得</div>
          <div class="name">${playerName}</div>
          <div class="achievement">${selectedAchievement.title}</div>
          <div class="achievement" style="font-size: 18px; color: #888;">${selectedAchievement.description}</div>
          <div class="date">頒發日期：${today}</div>
          <div class="footer">童樂學園 KidsZone</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <div className="inline-flex items-center gap-2 sm:gap-3">
            <Award className="w-8 h-8 sm:w-12 sm:h-12 text-[hsl(var(--macaron-yellow))]" />
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-[hsl(var(--macaron-purple-dark))]">
              小超人證書
            </h1>
            <Award className="w-8 h-8 sm:w-12 sm:h-12 text-[hsl(var(--macaron-yellow))]" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            完成挑戰獲得專屬證書！可以列印出來貼在牆上喔！
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-white">
          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6">
            成就徽章
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const Icon = achievement.icon;
              
              return (
                <motion.button
                  key={achievement.id}
                  whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                  whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedAchievement(achievement);
                      speak(achievement.title);
                    } else {
                      speak("還沒解鎖喔！繼續加油！");
                    }
                  }}
                  className={`
                    p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center gap-2 transition-all
                    ${isUnlocked 
                      ? `${achievement.bgColor} shadow-lg cursor-pointer ring-2 ring-white` 
                      : 'bg-gray-200 cursor-not-allowed opacity-60'}
                    ${selectedAchievement?.id === achievement.id ? 'ring-4 ring-yellow-400' : ''}
                  `}
                  data-testid={`achievement-${achievement.id}`}
                >
                  <div className={`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                    ${isUnlocked ? 'bg-white shadow-md' : 'bg-gray-300'}
                  `}>
                    {isUnlocked ? (
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${achievement.color}`} />
                    ) : (
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-center">{achievement.title}</span>
                  <span className="text-xs text-gray-500 text-center hidden sm:block">{achievement.description}</span>
                </motion.button>
              );
            })}
          </div>
        </div>


        {/* Certificate Generator - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-xl border-4 border-yellow-200"
        >
          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6">
            列印你的證書
          </h2>

          {/* Certificate Preview */}
          <div 
            ref={certificateRef}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-4 border-dashed border-yellow-300 text-center"
          >
            <div className="text-2xl sm:text-3xl mb-2">小超人證書</div>
            <div className="text-4xl sm:text-5xl my-4">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-500" />
            </div>
            <div className="text-base sm:text-lg text-gray-600 mb-2">恭喜獲得</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2">
              {playerName || "你的名字"}
            </div>
            <div className="text-lg sm:text-xl font-bold text-gray-700">
              {selectedAchievement?.title || "選擇一個成就"}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {selectedAchievement?.description || "點擊上方已解鎖的成就徽章"}
            </div>
          </div>

          {/* Name Input and Print Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <Input
              type="text"
              placeholder="輸入你的名字"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="max-w-xs text-center text-base sm:text-lg"
              data-testid="input-player-name"
            />
            <Button
              onClick={handlePrintCertificate}
              disabled={!playerName.trim() || !selectedAchievement}
              data-testid="button-print"
            >
              <Download className="w-5 h-5 mr-2" />
              列印證書
            </Button>
          </div>

          {!selectedAchievement && (
            <p className="text-center text-sm text-gray-500 mt-4">
              請先點擊上方已解鎖的成就徽章
            </p>
          )}
        </motion.div>

        {/* Instructions */}
        <div className="text-center text-sm sm:text-base text-gray-500 space-y-1">
          <p>完成遊戲達到目標分數或收集貼紙，就可以解鎖成就！</p>
          <p>點選已解鎖的成就，輸入名字就可以列印專屬證書！</p>
        </div>
      </div>
    </Layout>
  );
}
