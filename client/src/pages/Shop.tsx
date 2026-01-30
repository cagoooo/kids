import { useState } from "react";
import { useUser } from "@/hooks/use-user-context";
import { useSticker } from "@/hooks/use-sticker-context";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Lock, Check, Gift, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/use-sound-context";
import confetti from "canvas-confetti";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

// Define Shop Items
const PREMIUM_AVATARS = [
    { id: "robot", icon: "🤖", name: "機器人", price: 200 },
    { id: "wizard", icon: "🧙‍♂️", name: "大魔法師", price: 200 },
    { id: "ninja", icon: "🥷", name: "忍者", price: 200 },
    { id: "alien", icon: "👽", name: "外星人", price: 300 },
    { id: "dinosaur", icon: "🦖", name: "大恐龍", price: 300 },
    { id: "unicorn_avatar", icon: "🦄", name: "獨角獸", price: 500 },
];

const SHOP_TABS = [
    { id: "avatar", label: "造型頭像" },
    { id: "sticker", label: "驚喜卡包" },
];

export default function Shop() {
    const { profile, spendCoins, unlockAvatar } = useUser();
    const { unlockSticker, collectedStickers, STICKERS } = useSticker();
    const { playClick, playCorrect, playHover } = useSound();

    const [activeTab, setActiveTab] = useState("avatar");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newSticker, setNewSticker] = useState<any>(null);

    const handleBuyAttempt = (item: any) => {
        playClick();
        setSelectedItem(item);
        setShowConfirm(true);
    };

    const handleConfirmBuy = () => {
        if (!selectedItem) return;

        if (spendCoins(selectedItem.price)) {
            // Success
            playCorrect();
            setShowConfirm(false);

            if (activeTab === "avatar") {
                unlockAvatar(selectedItem.icon);
                setShowSuccess(true);
            } else if (activeTab === "sticker") {
                // Gacha Logic
                const rolledSticker = gachaRoll();
                unlockSticker(rolledSticker.id);
                setNewSticker(rolledSticker);
                setShowSuccess(true);
            }

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            // Fail (Should be handled by UI disabled state, but double check)
            alert("金幣不足喔！再多玩幾個遊戲吧！");
        }
    };

    const gachaRoll = () => {
        // Simple weighted random? Or strict random from unlocked?
        // Let's just pick a random sticker for now.
        // In future, filtering out already owned? Nah, duplicates are okay (maybe convert to coins?)
        // For MVP: Random from ALL stickers
        const randomIndex = Math.floor(Math.random() * STICKERS.length);
        return STICKERS[randomIndex];
    };

    const base = import.meta.env.BASE_URL.replace(/\/$/, "");

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href={base + "/"}>
                        <Button variant="ghost" className="rounded-xl hover:bg-white/50">
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            返回首頁
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-2xl font-black text-2xl shadow-lg border-4 border-white">
                        <Star className="w-8 h-8 fill-white text-white" />
                        <span>{profile.coins}</span>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-display text-4xl md:text-5xl font-black text-[#6B4C9A] mb-4 text-shadow-sm">
                        快樂商店
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">
                        用你的星星幣交換喜歡的禮物吧！
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    {SHOP_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); playHover(); }}
                            className={`
                px-8 py-3 rounded-2xl font-bold text-xl transition-all
                ${activeTab === tab.id
                                    ? "bg-[#6B4C9A] text-white shadow-lg scale-105"
                                    : "bg-white text-gray-400 hover:bg-gray-50"}
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 min-h-[400px] shadow-xl border-4 border-white/50">

                    {/* Avatar Shop */}
                    {activeTab === "avatar" && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {PREMIUM_AVATARS.map((avatar) => {
                                const isOwned = profile.unlockedAvatars.includes(avatar.icon);
                                const canAfford = profile.coins >= avatar.price;

                                return (
                                    <button
                                        key={avatar.id}
                                        disabled={isOwned}
                                        onClick={() => !isOwned && handleBuyAttempt(avatar)}
                                        className={`
                      relative group flex flex-col items-center p-6 rounded-3xl border-4 transition-all duration-300
                      ${isOwned
                                                ? "bg-gray-100 border-gray-200 opacity-80 cursor-default"
                                                : canAfford
                                                    ? "bg-white border-purple-200 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                                    : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"}
                    `}
                                    >
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                                            {avatar.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">{avatar.name}</h3>

                                        {isOwned ? (
                                            <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-bold flex items-center gap-1">
                                                <Check className="w-4 h-4" /> 已擁有
                                            </div>
                                        ) : (
                                            <div className={`
                        px-4 py-1 rounded-full font-bold flex items-center gap-1
                        ${canAfford ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-500"}
                      `}>
                                                <Star className="w-4 h-4 fill-current" /> {avatar.price}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Sticker Shop (Gacha) */}
                    {activeTab === "sticker" && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-9xl mb-8"
                            >
                                🎁
                            </motion.div>
                            <h3 className="text-3xl font-black text-purple-800 mb-4">驚喜貼紙包</h3>
                            <p className="text-xl text-gray-600 mb-8 max-w-md text-center">
                                隨機獲得一張貼紙！有機會獲得「傳說級」的稀有貼紙喔！
                            </p>

                            <button
                                onClick={() => handleBuyAttempt({ id: "gacha", name: "驚喜貼紙包", price: 50, type: "gacha" })}
                                disabled={profile.coins < 50}
                                className={`
                   px-12 py-6 rounded-3xl font-black text-2xl shadow-xl flex items-center gap-3 transition-all
                   ${profile.coins >= 50
                                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 active:scale-95"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                 `}
                            >
                                <Star className="w-8 h-8 fill-white" />
                                50 金幣抽一次
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold">確認購買</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="text-center py-6">
                            <div className="text-6xl mb-4">{activeTab === 'sticker' ? '🎁' : selectedItem.icon}</div>
                            <p className="text-lg text-gray-600 mb-2">確定要購買 <strong>{selectedItem.name}</strong> 嗎？</p>
                            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-xl">
                                <Star className="w-5 h-5 fill-current" /> {selectedItem.price}
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:justify-center">
                        <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-xl flex-1">
                            再想想
                        </Button>
                        <Button onClick={handleConfirmBuy} className="rounded-xl flex-1 bg-purple-600 hover:bg-purple-700">
                            確定購買
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Dialog (Avatar) */}
            <Dialog open={showSuccess && activeTab === 'avatar'} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-200">
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="spring"
                            className="text-8xl mb-4"
                        >
                            {selectedItem?.icon}
                        </motion.div>
                        <h2 className="text-3xl font-black text-orange-800 mb-2">購買成功！</h2>
                        <p className="text-lg text-orange-600">
                            你現在可以使用 <strong>{selectedItem?.name}</strong> 當作頭像囉！
                        </p>
                        <Button onClick={() => setShowSuccess(false)} className="mt-6 w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-lg h-12">
                            太棒了！
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Success Dialog (Sticker Gacha) */}
            <Dialog open={showSuccess && activeTab === 'sticker'} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-pink-200">
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            type="spring"
                            className="text-8xl mb-4"
                        >
                            {newSticker?.emoji}
                        </motion.div>
                        <h2 className="text-3xl font-black text-pink-800 mb-2">恭喜獲得！</h2>
                        <p className="text-lg text-pink-600 mb-1">
                            你抽到了 <strong>{newSticker?.name}</strong>！
                        </p>
                        <div className="text-sm font-bold bg-white/50 inline-block px-3 py-1 rounded-full text-pink-400">
                            {newSticker?.rarity}
                        </div>
                        <Button onClick={() => setShowSuccess(false)} className="mt-8 w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-lg h-12">
                            收下貼紙
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </Layout>
    );
}
