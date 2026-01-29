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
        className="w-full h-[600px] bg-white/40 backdrop-blur-sm rounded-[2rem] border-4 border-white/60 shadow-inner relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

        <div className="absolute top-4 right-4 text-muted-foreground/50 flex items-center gap-2 pointer-events-none">
          <Move className="w-5 h-5" />
          <span className="text-sm font-bold">拖拉貼紙來佈置！</span>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(var(--macaron-purple-dark))]">
            我的貼紙簿
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            拖拉貼紙，打造你的專屬樂園！
          </p>

          {/* Progress */}
          <div className="bg-white/60 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 inline-flex items-center gap-2 sm:gap-3 shadow-md">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-400" />
            <span className="font-display font-bold text-lg sm:text-xl">
              {collectedCount} / {totalCount}
            </span>
            <span className="text-sm sm:text-base text-muted-foreground">已收集</span>
          </div>
        </div>

        {/* Canvas */}
        <StickerCanvas />

        {/* Collection Grid (Reference) */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[hsl(var(--macaron-purple-dark))] mb-4 px-2">
            圖鑑一覽
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
            {STICKERS.map((sticker) => {
              const isCollected = collectedStickers.includes(sticker.id);
              return (
                <div
                  key={sticker.id}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl
                    ${isCollected ? 'bg-white shadow-sm' : 'bg-gray-100 opacity-50 grayscale'}
                  `}
                  title={sticker.name}
                >
                  {isCollected ? sticker.emoji : <Lock className="w-5 h-5" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
