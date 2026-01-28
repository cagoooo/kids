import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { Palette, Calculator, BookOpen, Star } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8 py-4">
        {/* Welcome Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block relative">
            <h1 className="font-display text-5xl md:text-7xl font-black text-[hsl(var(--macaron-purple-dark))] drop-shadow-sm leading-tight">
              Let's Play <br className="md:hidden"/> & Learn!
            </h1>
            <Star className="absolute -top-6 -right-6 w-12 h-12 text-[hsl(var(--macaron-yellow))] fill-current animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground font-medium max-w-lg mx-auto">
            Choose a game to start your adventure. Collect points and become a superstar! ⭐
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <GameCard
            title="Color Magic"
            description="Can you match the beautiful colors? Let's paint the world!"
            icon={Palette}
            color="pink"
            href="/game/color"
            delay={0.1}
          />
          
          <GameCard
            title="Math Whiz"
            description="Count apples, add stars, and become a number hero!"
            icon={Calculator}
            color="blue"
            href="/game/math"
            delay={0.2}
          />
          
          <GameCard
            title="Word Explorer"
            description="Match words with emojis. Learning English is fun!"
            icon={BookOpen}
            color="green"
            href="/game/english"
            delay={0.3}
          />
        </div>
      </div>
    </Layout>
  );
}
