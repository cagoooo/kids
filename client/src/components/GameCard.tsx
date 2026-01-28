import { motion } from "framer-motion";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "pink" | "blue" | "green" | "yellow" | "purple";
  href: string;
  delay?: number;
}

export function GameCard({ title, description, icon: Icon, color, href, delay = 0 }: GameCardProps) {
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
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative cursor-pointer rounded-3xl p-6 md:p-8 
          shadow-lg hover:shadow-xl transition-all duration-300
          border-4 border-white/50 backdrop-blur-sm
          ${colorClasses[color]}
          flex flex-col items-center text-center gap-4
          aspect-square justify-center
        `}
      >
        <div className="bg-white/30 p-4 rounded-full backdrop-blur-md shadow-inner">
          <Icon className="w-12 h-12 md:w-16 md:h-16 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 text-shadow">{title}</h3>
          <p className="font-medium opacity-90 text-sm md:text-base leading-tight">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
