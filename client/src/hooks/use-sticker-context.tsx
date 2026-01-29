import React, { createContext, useContext, useState, useEffect } from "react";

// Sticker Definition
export interface Sticker {
    id: number;
    emoji: string;
    name: string;
    rarity: "普通" | "稀有" | "傳說";
    description?: string;
}

export const STICKERS: Sticker[] = [
    { id: 1, emoji: "🦄", name: "獨角獸", rarity: "稀有" },
    { id: 2, emoji: "🐱", name: "小貓咪", rarity: "普通" },
    { id: 3, emoji: "🐶", name: "小狗狗", rarity: "普通" },
    { id: 4, emoji: "🐰", name: "小兔子", rarity: "普通" },
    { id: 5, emoji: "🦋", name: "蝴蝶", rarity: "稀有" },
    { id: 6, emoji: "🌈", name: "彩虹", rarity: "稀有" },
    { id: 7, emoji: "⭐", name: "星星", rarity: "普通" },
    { id: 8, emoji: "🌸", name: "櫻花", rarity: "普通" },
    { id: 9, emoji: "🍰", name: "蛋糕", rarity: "普通" },
    { id: 10, emoji: "🍭", name: "棒棒糖", rarity: "普通" },
    { id: 11, emoji: "🎀", name: "蝴蝶結", rarity: "普通" },
    { id: 12, emoji: "🎈", name: "氣球", rarity: "普通" },
    { id: 13, emoji: "🦊", name: "小狐狸", rarity: "稀有" },
    { id: 14, emoji: "🐼", name: "熊貓", rarity: "稀有" },
    { id: 15, emoji: "🦁", name: "獅子", rarity: "稀有" },
    { id: 16, emoji: "🐧", name: "企鵝", rarity: "普通" },
    { id: 17, emoji: "🦀", name: "螃蟹", rarity: "普通" },
    { id: 18, emoji: "🐳", name: "鯨魚", rarity: "稀有" },
    { id: 19, emoji: "🌟", name: "閃亮星", rarity: "傳說" },
    { id: 20, emoji: "👑", name: "皇冠", rarity: "傳說" },
];

// Achievement Definition
export interface Achievement {
    id: string;
    name: string;
    criteria: (stats: UserStats) => boolean;
    rewardStickerId: number;
    description: string;
}

interface UserStats {
    totalScore: number;
    gamesPlayed: number;
}

interface StickerPosition {
    id: number; // Sticker ID
    x: number;
    y: number;
}

interface StickerContextType {
    collectedStickers: number[];
    stickerPositions: Record<number, StickerPosition>;
    userStats: UserStats;
    unlockSticker: (id: number) => void;
    updateStickerPosition: (id: number, x: number, y: number) => void;
    updateStats: (score: number) => void;
    checkAchievements: () => Sticker | null; // Returns newly unlocked sticker if any
}

const StickerContext = createContext<StickerContextType | undefined>(undefined);

const STORAGE_KEY_COLLECTED = "kidszone_stickers_collected";
const STORAGE_KEY_POSITIONS = "kidszone_stickers_positions";
const STORAGE_KEY_STATS = "kidszone_user_stats";

// Define Achievements
const ACHIEVEMENTS: Achievement[] = [
    { id: "first_win", name: "初次見面", criteria: (s) => s.gamesPlayed >= 1, rewardStickerId: 1, description: "玩第一次遊戲" },
    { id: "score_100", name: "小小探險家", criteria: (s) => s.totalScore >= 100, rewardStickerId: 2, description: "總分超過 100 分" },
    { id: "games_5", name: "遊戲愛好者", criteria: (s) => s.gamesPlayed >= 5, rewardStickerId: 3, description: "玩過 5 次遊戲" },
    { id: "score_500", name: "超級巨星", criteria: (s) => s.totalScore >= 500, rewardStickerId: 19, description: "總分超過 500 分" },
    // Add more achievements mapping to other stickers...
];

export function StickerProvider({ children }: { children: React.ReactNode }) {
    // State
    const [collectedStickers, setCollectedStickers] = useState<number[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_COLLECTED);
        return saved ? JSON.parse(saved) : [];
    });

    const [stickerPositions, setStickerPositions] = useState<Record<number, StickerPosition>>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_POSITIONS);
        return saved ? JSON.parse(saved) : {};
    });

    const [userStats, setUserStats] = useState<UserStats>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_STATS);
        return saved ? JSON.parse(saved) : { totalScore: 0, gamesPlayed: 0 };
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_COLLECTED, JSON.stringify(collectedStickers));
    }, [collectedStickers]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(stickerPositions));
    }, [stickerPositions]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(userStats));
    }, [userStats]);

    // Actions
    const unlockSticker = (id: number) => {
        if (!collectedStickers.includes(id)) {
            setCollectedStickers(prev => [...prev, id]);
        }
    };

    const updateStickerPosition = (id: number, x: number, y: number) => {
        setStickerPositions(prev => ({
            ...prev,
            [id]: { id, x, y }
        }));
    };

    const updateStats = (score: number) => {
        setUserStats(prev => ({
            totalScore: prev.totalScore + score,
            gamesPlayed: prev.gamesPlayed + 1
        }));
    };

    const checkAchievements = (): Sticker | null => {
        // Simple logic: Find the first achievement that is met but not yet collected
        // In a real app, you might want to return multiple or handle this more robustly

        // First, check defined achievements
        for (const ach of ACHIEVEMENTS) {
            if (ach.criteria(userStats) && !collectedStickers.includes(ach.rewardStickerId)) {
                unlockSticker(ach.rewardStickerId);
                return STICKERS.find(s => s.id === ach.rewardStickerId) || null;
            }
        }

        // Fallback: Random unlock if score is high enough (keep existing fun logic)
        // Every 100 points gives a chance for a random sticker
        if (userStats.totalScore > 0 && userStats.totalScore % 50 === 0) {
            const uncollected = STICKERS.filter(s => !collectedStickers.includes(s.id));
            if (uncollected.length > 0) {
                const random = uncollected[Math.floor(Math.random() * uncollected.length)];
                unlockSticker(random.id);
                return random;
            }
        }

        return null;
    };

    return (
        <StickerContext.Provider value={{
            collectedStickers,
            stickerPositions,
            userStats,
            unlockSticker,
            updateStickerPosition,
            updateStats,
            checkAchievements
        }}>
            {children}
        </StickerContext.Provider>
    );
}

export function useSticker() {
    const context = useContext(StickerContext);
    if (context === undefined) {
        throw new Error("useSticker must be used within a StickerProvider");
    }
    return context;
}
