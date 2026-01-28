import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Home, Star } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Playful Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-full shadow-lg border-2 border-white px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[hsl(var(--macaron-pink))] to-[hsl(var(--macaron-purple))] rounded-full flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
              <Star className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight text-shadow">
              Kids<span className="text-[hsl(var(--macaron-pink-dark))]">Zone</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            <Link href="/">
              <div className={`p-3 rounded-full transition-all cursor-pointer ${location === '/' ? 'bg-[hsl(var(--macaron-blue))] text-white shadow-md' : 'hover:bg-gray-100 text-gray-500'}`}>
                <Home className="w-6 h-6" />
              </div>
            </Link>
            <Link href="/scores">
              <div className={`p-3 rounded-full transition-all cursor-pointer ${location === '/scores' ? 'bg-[hsl(var(--macaron-yellow))] text-orange-900 shadow-md' : 'hover:bg-gray-100 text-gray-500'}`}>
                <Trophy className="w-6 h-6" />
              </div>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 relative">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[hsl(var(--macaron-purple-dark))] opacity-60 font-display text-sm">
        Made with 💖 for Learning • Macaron Theme
      </footer>
    </div>
  );
}
