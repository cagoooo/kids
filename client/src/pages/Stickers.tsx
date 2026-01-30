import { useState } from "react";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Star, Lock, Move } from "lucide-react";
import { useSticker, STICKERS } from "@/hooks/use-sticker-context";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";

function DraggableSticker({ id, emoji, name, x, y }: { id: number, emoji: string, name: string, x: number, y: number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sticker-${id}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        ...style
      }}
      {...listeners}
      {...attributes}
      className="cursor-move select-none flex flex-col items-center group z-10"
    >
      <div className="text-5xl sm:text-6xl drop-shadow-md transition-transform group-hover:scale-110 active:scale-125">
        {emoji}
      </div>
      <span className="bg-white/80 px-2 py-0.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {name}
      </span>
    </div>
  );
}

function StickerCanvas() {
  const { collectedStickers, stickerPositions, updateStickerPosition } = useSticker();
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const stickerId = parseInt(active.id.toString().replace('sticker-', ''));

    const currentPos = stickerPositions[stickerId] || { x: 50, y: 50 };

    updateStickerPosition(
      stickerId,
      Math.max(0, Math.min(currentPos.x + delta.x, window.innerWidth - 100)), // Simple bounds
      Math.max(0, Math.min(currentPos.y + delta.y, 500))
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        className="w-full h-[600px] bg-white rounded-[1.5rem] relative overflow-hidden cursor-crosshair group"
        style={{
          backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(to bottom, transparent 19px, #d4f1f9 20px)',
          backgroundSize: '20px 20px, 100% 20px'
        }}
      >
        <div className="absolute top-4 left-4 text-blue-300 font-bold text-xl opacity-30 pointer-events-none select-none">
          Sticker Book
        </div>

        <div className="absolute top-4 right-4 text-gray-400 bg-white/80 px-3 py-1 rounded-full shadow-sm flex items-center gap-2 pointer-events-none border border-gray-100">
          <Move className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold">按住貼紙可以移動位置喔！</span>
        </div>

        {collectedStickers.map(id => {
          const sticker = STICKERS.find(s => s.id === id);
          if (!sticker) return null;

          // Default random position if not set
          const pos = stickerPositions[id] || {
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 50
          };

          return (
            <DraggableSticker
              key={id}
              id={id}
              emoji={sticker.emoji}
              name={sticker.name}
              x={pos.x}
              y={pos.y}
            />
          );
        })}

        {collectedStickers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-bold text-xl">
            還沒有貼紙喔，快去玩遊戲收集！
          </div>
        )}
      </div>
    </DndContext>
  );
}

export default function Stickers() {
  const { collectedStickers } = useSticker();
  const collectedCount = collectedStickers.length;
  const totalCount = STICKERS.length;

  return (
    <Layout>
      <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
        {/* Header Section with Bouncing Title */}
        <div className="text-center space-y-4 py-6 bg-white/50 backdrop-blur-sm rounded-[3rem] shadow-sm border-2 border-white/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 drop-shadow-sm tracking-tight mb-2">
              我的貼紙簿
            </h1>
          </motion.div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-lg text-gray-600 font-bold bg-white/80 px-6 py-1 rounded-full shadow-sm">
              即將充滿魔法的專屬樂園！✨
            </p>

            {/* Progress Bar Container */}
            <div className="relative w-64 h-8 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-300 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${(collectedCount / totalCount) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-md">
                {collectedCount} / {totalCount}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Canvas - The "Playmat" */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-[#fff9c4] p-4 rounded-[2.5rem] shadow-2xl border-8 border-[#fdd835] relative transform -rotate-1">
              {/* Ring Binder Holes decorations */}
              <div className="absolute -left-4 top-1/4 w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-400 shadow-inner z-10"></div>
              <div className="absolute -left-4 top-2/4 w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-400 shadow-inner z-10"></div>
              <div className="absolute -left-4 top-3/4 w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-400 shadow-inner z-10"></div>

              <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner min-h-[600px] relative border-4 border-dashed border-yellow-200">
                <StickerCanvas />
              </div>
            </div>
          </div>

          {/* Sticker Collection - The "Sticker Sheet" */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border-4 border-purple-100 flex flex-col h-full">
              <h3 className="text-2xl font-black text-purple-600 mb-4 flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-500" />
                貼紙圖鑑
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {STICKERS.map((sticker) => {
                  const isCollected = collectedStickers.includes(sticker.id);
                  return (
                    <motion.div
                      key={sticker.id}
                      whileHover={{ scale: 1.05, rotate: isCollected ? [0, -5, 5, 0] : 0 }}
                      className={`
                                        aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border-b-4 transition-all relative overflow-hidden group
                                        ${isCollected
                          ? 'bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-md cursor-grab active:cursor-grabbing'
                          : 'bg-gray-100 border-gray-200 inner-shadow opacity-60'}
                                    `}
                      title={sticker.name}
                    >
                      {isCollected ? (
                        <>
                          <div className="text-4xl filter drop-shadow-sm transform transition-transform group-hover:scale-110">
                            {sticker.emoji}
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 mt-1 bg-white/50 px-2 rounded-full">
                            {sticker.name}
                          </span>
                          {/* Sparkle effect */}
                          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" />
                        </>
                      ) : (
                        <Lock className="w-6 h-6 text-gray-300" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 p-4 bg-purple-50 rounded-xl text-xs text-purple-600 font-bold text-center">
                💡 小提示：玩遊戲獲得高分就能解鎖更多貼紙喔！
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
