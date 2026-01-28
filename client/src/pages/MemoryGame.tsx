import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";

interface Card {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = [
  { emoji: "🐰", name: "兔子" },
  { emoji: "🐻", name: "熊" },
  { emoji: "🦊", name: "狐狸" },
  { emoji: "🐼", name: "熊貓" },
  { emoji: "🐨", name: "無尾熊" },
  { emoji: "🦁", name: "獅子" },
  { emoji: "🐯", name: "老虎" },
  { emoji: "🐸", name: "青蛙" },
];

export default function MemoryGame() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(6);
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  const initializeCards = () => {
    const pairCount = round < 3 ? 6 : 8;
    setTotalPairs(pairCount);
    
    const selectedPairs = [...CARD_PAIRS]
      .sort(() => 0.5 - Math.random())
      .slice(0, pairCount);
    
    const cardDeck = selectedPairs.flatMap((pair, idx) => [
      { id: idx * 2, ...pair, isFlipped: false, isMatched: false },
      { id: idx * 2 + 1, ...pair, isFlipped: false, isMatched: false },
    ]);
    
    return cardDeck.sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    if (round >= 5) {
      setIsGameOver(true);
      return;
    }
    setCards(initializeCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsChecking(false);
    speak("翻開卡片，找到一樣的動物！");
  }, [round]);

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    speak(card.name);
    
    if (newFlipped.length === 2) {
      setIsChecking(true);
      
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first)!;
      const secondCard = cards.find(c => c.id === second)!;
      
      setTimeout(() => {
        if (firstCard.emoji === secondCard.emoji) {
          confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
          speak("配對成功！");
          
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true } 
              : c
          ));
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);
          setScore(s => s + 10);
          
          if (newMatchedPairs === totalPairs) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            speak("太棒了！全部配對完成！");
            setTimeout(() => setRound(r => r + 1), 1500);
          }
        } else {
          speak("不一樣喔，再記一次！");
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false } 
              : c
          ));
        }
        
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const restart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setMatchedPairs(0);
  };

  const gridCols = totalPairs === 6 ? "grid-cols-4" : "grid-cols-4";
  const cardSize = totalPairs === 6 
    ? "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" 
    : "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16";

  return (
    <Layout>
      <GameShell
        title="魔法翻翻牌"
        score={score}
        totalQuestions={5}
        currentQuestionIndex={round}
        gameType="memory"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
          <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-center px-2">
            找到一樣的動物朋友！
          </h3>

          {/* Progress */}
          <div className="text-sm sm:text-base font-medium">
            已配對：{matchedPairs} / {totalPairs}
          </div>

          {/* Card Grid */}
          <div className={`grid ${gridCols} gap-2 sm:gap-3`}>
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || isChecking}
                className={`
                  ${cardSize} rounded-xl sm:rounded-2xl shadow-lg relative
                  ${card.isMatched ? 'opacity-0 pointer-events-none' : ''}
                `}
                whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid={`card-${card.id}`}
              >
                <motion.div
                  className="w-full h-full relative"
                  initial={false}
                  animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Back */}
                  <div 
                    className="absolute inset-0 bg-[hsl(var(--macaron-purple))] rounded-xl sm:rounded-2xl flex items-center justify-center border-4 border-white"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-xl sm:text-2xl md:text-3xl text-white">?</span>
                  </div>
                  
                  {/* Card Front */}
                  <div 
                    className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border-4 border-[hsl(var(--macaron-purple))]"
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <span className="text-2xl sm:text-3xl md:text-4xl">{card.emoji}</span>
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Hint */}
          <p className="text-xs sm:text-sm text-center opacity-70 px-4">
            翻開兩張卡片，如果圖案一樣就會消失得分！
          </p>
        </div>
      </GameShell>
    </Layout>
  );
}
