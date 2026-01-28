import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GameShell } from "@/components/GameShell";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useTTS } from "@/hooks/use-tts";

const EMOTIONS = [
  { id: "happy", name: "開心", weather: "☀️", color: "hsl(var(--macaron-yellow))", face: "😊" },
  { id: "sad", name: "難過", weather: "🌧️", color: "hsl(var(--macaron-blue))", face: "😢" },
  { id: "angry", name: "生氣", weather: "⛈️", color: "hsl(var(--macaron-pink))", face: "😠" },
  { id: "scared", name: "害怕", weather: "🌪️", color: "hsl(var(--macaron-purple))", face: "😨" },
  { id: "surprised", name: "驚訝", weather: "🌈", color: "hsl(var(--macaron-green))", face: "😮" },
];

const SCENARIOS = [
  { text: "小明收到生日禮物", emotion: "happy" },
  { text: "小美的冰淇淋掉在地上了", emotion: "sad" },
  { text: "有人搶走了小華的玩具", emotion: "angry" },
  { text: "小芳在黑黑的房間裡聽到奇怪的聲音", emotion: "scared" },
  { text: "小明突然收到一個驚喜派對", emotion: "surprised" },
  { text: "媽媽答應帶小美去遊樂園玩", emotion: "happy" },
  { text: "小狗跑不見了，找不到", emotion: "sad" },
  { text: "弟弟把姐姐的畫撕破了", emotion: "angry" },
  { text: "雷聲轟隆隆的響", emotion: "scared" },
  { text: "朋友突然從門後跳出來", emotion: "surprised" },
];

function DraggableEmotion({ emotion }: { emotion: typeof EMOTIONS[0] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: emotion.id });
  const { speak } = useTTS();

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: isDragging ? 100 : 1,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
      onMouseEnter={() => speak(emotion.name)}
      data-testid={`emotion-${emotion.id}`}
    >
      <div 
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white"
        style={{ backgroundColor: emotion.color }}
      >
        <span className="text-3xl md:text-4xl">{emotion.weather}</span>
      </div>
      <span className="text-sm font-bold">{emotion.name}</span>
    </motion.div>
  );
}

function FaceDropzone({ currentEmotion, isCorrect }: { currentEmotion: string | null; isCorrect: boolean | null }) {
  const { isOver, setNodeRef } = useDroppable({ id: "face" });
  const emotion = EMOTIONS.find(e => e.id === currentEmotion);

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        scale: isOver ? 1.1 : 1,
        rotate: isCorrect === false ? [-5, 5, -5, 5, 0] : 0,
      }}
      className={`
        w-40 h-40 md:w-48 md:h-48 rounded-full bg-[hsl(var(--macaron-yellow)/0.3)] 
        flex items-center justify-center border-8 border-white shadow-xl
        ${isOver ? 'ring-4 ring-white/50' : ''}
        ${isCorrect === true ? 'ring-4 ring-green-400' : ''}
        ${isCorrect === false ? 'ring-4 ring-red-400' : ''}
      `}
      data-testid="face-dropzone"
    >
      {currentEmotion ? (
        <span className="text-8xl md:text-9xl">{emotion?.face}</span>
      ) : (
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-2">😐</div>
          <span className="text-sm">拖曳心情到這裡</span>
        </div>
      )}
    </motion.div>
  );
}

export default function EmotionGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(SCENARIOS[0]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const { speak } = useTTS();

  const setupRound = () => {
    if (questionIndex >= 10) {
      setIsGameOver(true);
      return;
    }

    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setCurrentScenario(scenario);
    setSelectedEmotion(null);
    setIsCorrect(null);
    
    speak(scenario.text);
  };

  useEffect(() => {
    setupRound();
  }, [questionIndex]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || over.id !== "face") return;

    const draggedEmotion = active.id as string;
    setSelectedEmotion(draggedEmotion);

    if (draggedEmotion === currentScenario.emotion) {
      setIsCorrect(true);
      confetti({ particleCount: 40, spread: 60 });
      const emotion = EMOTIONS.find(e => e.id === draggedEmotion);
      speak(`答對了！這時候會感到${emotion?.name}！`);
      setScore(s => s + 10);
      setTimeout(() => setQuestionIndex(i => i + 1), 1500);
    } else {
      setIsCorrect(false);
      speak("想一想，這時候會有什麼感覺呢？");
      setTimeout(() => {
        setSelectedEmotion(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <Layout>
      <GameShell
        title="心情氣象台"
        score={score}
        totalQuestions={10}
        currentQuestionIndex={questionIndex}
        gameType="emotion"
        isGameOver={isGameOver}
        onRestart={restart}
        colorClass="bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]"
      >
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col items-center gap-6">
            {/* Scenario */}
            <div className="bg-white/40 px-6 py-4 rounded-2xl max-w-md">
              <h3 className="font-display text-xl md:text-2xl font-bold text-center">
                {currentScenario.text}
              </h3>
              <p className="text-center text-sm opacity-70 mt-2">
                這時候會有什麼心情呢？
              </p>
            </div>

            {/* Face Dropzone */}
            <FaceDropzone currentEmotion={selectedEmotion} isCorrect={isCorrect} />

            {/* Emotion Options */}
            <div className="flex gap-3 md:gap-4 flex-wrap justify-center mt-4">
              {EMOTIONS.map((emotion) => (
                <DraggableEmotion key={emotion.id} emotion={emotion} />
              ))}
            </div>
          </div>
        </DndContext>
      </GameShell>
    </Layout>
  );
}
