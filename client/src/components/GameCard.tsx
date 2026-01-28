import { motion } from "framer-motion";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "pink" | "blue" | "green" | "yellow" | "purple";
  href: string;
  delay?: number;
}

export function GameCard({ title, description, icon: Icon, color, href, delay = 0 }: GameCardProps) {
  const { speak } = useTTS();
  
  const colorClasses = {
    pink: "bg-[hsl(var(--macaron-pink))] text-[hsl(var(--macaron-pink-dark))]",
    blue: "bg-[hsl(var(--macaron-blue))] text-[hsl(var(--macaron-blue-dark))]",
    green: "bg-[hsl(var(--macaron-green))] text-[hsl(var(--macaron-green-dark))]",
    yellow: "bg-[hsl(var(--macaron-yellow))] text-[hsl(var(--macaron-yellow-dark))]",
    purple: "bg-[hsl(var(--macaron-purple))] text-[hsl(var(--macaron-purple-dark))]",
  };

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => speak(title)}
        className={`
          relative cursor-pointer rounded-2xl md:rounded-3xl p-4 md:p-6
          shadow-lg hover:shadow-xl transition-all duration-300
          border-4 border-white/50 backdrop-blur-sm
          ${colorClasses[color]}
          flex flex-col items-center text-center gap-2 md:gap-3
          aspect-square justify-center
        `}
        data-testid={`game-card-${href.split('/').pop()}`}
      >
        <div className="bg-white/30 p-3 md:p-4 rounded-full backdrop-blur-md shadow-inner">
          <Icon className="w-8 h-8 md:w-12 md:h-12 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-display text-lg md:text-xl font-bold mb-1 leading-tight drop-shadow-sm">{title}</h3>
          <p className="font-semibold text-xs md:text-sm leading-tight hidden md:block drop-shadow-sm">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
