import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTTS } from "@/hooks/use-tts";
import { MEMORY_LEVELS, CardType } from "@/data/memory-levels";
import { Star } from "lucide-react";

interface Card {
  id: number;
  pairId: string;
  content: string;
  type: CardType;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(6);
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  const currentLevelConfig = MEMORY_LEVELS.find(l => l.id === level) || MEMORY_LEVELS[0];

  const initializeCards = () => {
    // Determine pair count based on level difficulty or fixed size
    // For now, let's keep it consistent: 6 pairs for easy game flow, or 8 for harder?
    // Let's use 6 pairs for Level 1, 8 pairs for Levels 2 & 3
    const pairCount = level === 1 ? 6 : 8;
    setTotalPairs(pairCount);

    // Select random pairs from the level config
    const availablePairs = [...currentLevelConfig.pairs]
      .sort(() => 0.5 - Math.random())
      .slice(0, pairCount);

    // Create deck
    const cardDeck: Card[] = availablePairs.flatMap((pair, idx) => {
      // Ensure we take both items from the pair
      const item1 = pair.items[0];
      const item2 = pair.items[1];

      return [
        {
          id: idx * 2,
          pairId: pair.pairId,
          content: item1.content,
          type: item1.type,
          isFlipped: false,
          isMatched: false
        },
        {
          id: idx * 2 + 1,
          pairId: pair.pairId,
          content: item2.content,
          type: item2.type,
          isFlipped: false,
          isMatched: false
        },
      ];
    });

    return cardDeck.sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    startLevel();
  }, [level]);

  const startLevel = () => {
    setIsGameOver(false);
    setCards(initializeCards());
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsChecking(false);
    speak(`第${level}關，${currentLevelConfig.name}！${currentLevelConfig.description}`);
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Play sound
    // playClick(); // Assumed handled or added if needed

    // Flip card
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards(cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Speak content if it's not too long (arithmetic might be weird but OK)
    // Replace symbols for better speech if needed
    let speakText = card.content;
    if (speakText.includes("+")) speakText = speakText.replace("+", "加");
    if (speakText.includes("-")) speakText = speakText.replace("-", "減");
    speak(speakText);

    if (newFlipped.length === 2) {
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId)!;
      const secondCard = cards.find(c => c.id === secondId)!;

      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          // MATCH!
          confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
          speak("答對了！");

          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          ));

          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          if (newMatchedPairs === totalPairs) {
            handleLevelComplete();
          }
        } else {
          // NO MATCH
          speak("再試一次！");
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
        }

        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const handleLevelComplete = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    speak("太棒了！過關！");

    setTimeout(() => {
      if (level < 3) {
        setLevel(l => l + 1);
      } else {
        setIsGameOver(true);
      }
    }, 2000);
  };

  const restart = () => {
    setLevel(1); // Reset to level 1 on full restart
  };

  const gridCols = totalPairs === 6 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-4";
  const cardSize = totalPairs === 6
    ? "w-20 h-24 sm:w-24 sm:h-32 md:w-28 md:h-36"
    : "w-16 h-20 sm:w-20 sm:h-28 md:w-24 md:h-32";

  return (
    <Layout>
      <GameShell
        title={`魔法翻翻牌 - Level ${level}`}
        score={level * 100 + matchedPairs * 10}
        totalQuestions={3} // 3 Levels
        currentQuestionIndex={level - 1}
        gameType="memory"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
      >
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto">
          {/* Level Info Header */}
          <div className="flex items-center gap-2 bg-white/50 px-6 py-2 rounded-full shadow-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-lg text-purple-700">{currentLevelConfig.name}</span>
            <span className="text-purple-400">|</span>
            <span className="text-sm text-purple-600">{currentLevelConfig.description}</span>
          </div>

          {/* Progress */}
          <div className="text-sm font-bold text-purple-400">
            配對進度：{matchedPairs} / {totalPairs}
          </div>

          {/* Card Grid */}
          <div className={`grid ${gridCols} gap-3 sm:gap-4 p-2`}>
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || isChecking}
                className={`
                  relative rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 transform perspective-1000
                  ${cardSize}
                  ${card.isMatched ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100'}
                `}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  initial={false}
                  animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center border-4 border-white shadow-inner backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-3xl sm:text-4xl text-white opacity-80 font-black">?</span>
                  </div>

                  {/* Card Front */}
                  <div
                    className={`
                        absolute inset-0 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border-4 
                        ${card.type === 'text' ? 'border-pink-300 bg-pink-50' : 'border-purple-300'}
                        shadow-sm backface-hidden
                    `}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <span className={`
                        font-black text-center px-1
                        ${card.type === 'text' ? 'text-lg sm:text-xl text-purple-600 font-display' : 'text-4xl sm:text-6xl'}
                    `}>
                      {card.content}
                    </span>
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </GameShell>
    </Layout>
  );
}
