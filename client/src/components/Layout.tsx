import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Home, Star, Sticker, Award, Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/use-sound-context";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Playful Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-full shadow-lg border-2 border-white px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href={base + "/"} className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[hsl(var(--macaron-pink))] to-[hsl(var(--macaron-purple))] rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
              <Star className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="font-display text-xl md:text-3xl font-bold text-foreground tracking-tight text-shadow">
              童樂<span className="text-[hsl(var(--macaron-pink-dark))]">學園</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 md:gap-3">
            <button
              onClick={toggleMute}
              className={`p-2 md:p-3 rounded-full transition-all cursor-pointer hover:bg-gray-100 text-gray-500`}
              title={isMuted ? "開啟聲音" : "靜音"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Link href={base + "/"}>
              <div
                className={`p-2 md:p-3 rounded-full transition-all cursor-pointer ${location === base + '/' ? 'bg-[hsl(var(--macaron-blue))] text-white shadow-md' : 'hover:bg-gray-100 text-gray-500'}`}
                data-testid="nav-home"
              >
                <Home className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
            <Link href={base + "/stickers"}>
              <div
                className={`p-2 md:p-3 rounded-full transition-all cursor-pointer ${location === base + '/stickers' ? 'bg-[hsl(var(--macaron-pink))] text-white shadow-md' : 'hover:bg-gray-100 text-gray-500'}`}
                data-testid="nav-stickers"
              >
                <Sticker className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
            <Link href={base + "/scores"}>
              <div
                className={`p-2 md:p-3 rounded-full transition-all cursor-pointer ${location === base + '/scores' ? 'bg-[hsl(var(--macaron-yellow))] text-orange-900 shadow-md' : 'hover:bg-gray-100 text-gray-500'}`}
                data-testid="nav-scores"
              >
                <Trophy className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
            <Link href={base + "/certificates"}>
              <div
                className={`p-2 md:p-3 rounded-full transition-all cursor-pointer ${location === base + '/certificates' ? 'bg-[hsl(var(--macaron-green))] text-white shadow-md' : 'hover:bg-gray-100 text-gray-500'}`}
                data-testid="nav-certificates"
              >
                <Award className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
          </nav>
        </div>
      </header>



      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[hsl(var(--macaron-purple-dark))] opacity-60 font-display text-sm">
        用愛製作 · 馬卡龍主題
      </footer>
    </div>
  );
}
