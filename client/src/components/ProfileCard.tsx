import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/use-user-context";
import { useSticker, STICKERS } from "@/hooks/use-sticker-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Sparkles, Smile, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Expanded Avatar List
const AVATARS = [
    // Classic
    "😊", "👦", "👧",
    // Roles
    "👨‍🚀", "👸", "🦸", "🧚‍♀️", "🧙‍♂️", "👮‍♂️", "🕵️‍♀️", "🧑‍🍳",
    // Animals
    "🐶", "🐱", "🐰", "🦊", "🦁", "🐯", "🦄", "🦕", "🐨", "🐼",
    // Fantasy & Others
    "👽", "🤖", "👻", "⭐", "🌈", "🚀"
];

export function ProfileCard() {
    const { profile, updateProfile } = useUser();
    const { collectedStickers } = useSticker();
    const [isOpen, setIsOpen] = useState(false);
    const [tempName, setTempName] = useState(profile.name);
    const [tempAvatar, setTempAvatar] = useState(profile.avatar);
    const [tempDecoration, setTempDecoration] = useState<number | null | undefined>(profile.decorationId);

    const handleOpen = () => {
        setTempName(profile.name);
        setTempAvatar(profile.avatar);
        setTempDecoration(profile.decorationId);
        setIsOpen(true);
    };

    const handleSave = () => {
        updateProfile(tempName, tempAvatar, tempDecoration);
        setIsOpen(false);
    };

    const currentDecoration = STICKERS.find(s => s.id === profile.decorationId);
    const tempDecorationObj = STICKERS.find(s => s.id === tempDecoration);

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="bg-white/80 backdrop-blur-sm border-4 border-white rounded-3xl p-4 flex items-center gap-4 shadow-lg cursor-pointer max-w-sm mx-auto mb-8 hover:shadow-xl transition-all"
            >
                <div className="relative w-16 h-16">
                    <div className="w-16 h-16 bg-[hsl(var(--macaron-blue))] rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-white overflow-hidden">
                        <span className="z-10">{profile.avatar}</span>
                    </div>
                    {currentDecoration && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-md border border-gray-100 z-20"
                        >
                            {currentDecoration.emoji}
                        </motion.div>
                    )}
                </div>

                <div className="flex-1 text-left">
                    <p className="text-sm text-muted-foreground font-bold">我是...</p>
                    <h3 className="text-2xl font-display font-black text-[hsl(var(--macaron-blue-dark))]">
                        {profile.name || "點擊設定名字"}
                    </h3>
                </div>
                <div className="bg-[hsl(var(--macaron-yellow))] p-2 rounded-full text-white">
                    <Edit2 className="w-5 h-5" />
                </div>
            </motion.div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg border-4 border-[hsl(var(--macaron-blue))] rounded-3xl bg-white/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="font-display text-3xl text-center text-[hsl(var(--macaron-blue-dark))]">
                            設計你的專屬頭像
                        </DialogTitle>
                    </DialogHeader>

                    {/* Preview Area */}
                    <div className="flex justify-center my-4">
                        <div className="relative">
                            <motion.div
                                key={tempAvatar}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white"
                            >
                                {tempAvatar}
                            </motion.div>
                            {tempDecorationObj && (
                                <motion.div
                                    key={tempDecoration}
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-200"
                                >
                                    {tempDecorationObj.emoji}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <Tabs defaultValue="avatar" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 bg-blue-50/50 p-1">
                            <TabsTrigger value="avatar" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 font-bold">
                                <Smile className="w-4 h-4 mr-2" />
                                選擇角色
                            </TabsTrigger>
                            <TabsTrigger value="decoration" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600 font-bold">
                                <Sparkles className="w-4 h-4 mr-2" />
                                裝飾配件 ({collectedStickers.length})
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-4 bg-white/50 rounded-2xl mt-2 h-[200px] overflow-y-auto custom-scrollbar">
                            <TabsContent value="avatar" className="mt-0">
                                <div className="grid grid-cols-5 gap-2">
                                    {AVATARS.map((avatar) => (
                                        <button
                                            key={avatar}
                                            onClick={() => setTempAvatar(avatar)}
                                            className={`text-2xl p-2 rounded-xl transition-all aspect-square flex items-center justify-center ${tempAvatar === avatar
                                                ? "bg-blue-100 shadow-sm scale-110 border-2 border-blue-200"
                                                : "hover:bg-white/80"
                                                }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="decoration" className="mt-0">
                                {collectedStickers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                        <Sparkles className="w-8 h-8 opacity-50" />
                                        <p className="text-sm font-bold">還沒有貼紙喔！去玩遊戲收集吧！</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-5 gap-2">
                                        <button
                                            onClick={() => setTempDecoration(null)}
                                            className={`text-sm p-2 rounded-xl transition-all aspect-square flex items-center justify-center font-bold text-gray-400 border-2 border-dashed border-gray-300 hover:bg-gray-50
                                                ${tempDecoration === null ? "bg-gray-100 border-gray-400 text-gray-600" : ""}
                                            `}
                                        >
                                            無
                                        </button>
                                        {collectedStickers.map((id) => {
                                            const sticker = STICKERS.find(s => s.id === id);
                                            if (!sticker) return null;
                                            return (
                                                <button
                                                    key={sticker.id}
                                                    onClick={() => setTempDecoration(sticker.id)}
                                                    className={`text-2xl p-2 rounded-xl transition-all aspect-square flex items-center justify-center ${tempDecoration === sticker.id
                                                        ? "bg-pink-100 shadow-sm scale-110 border-2 border-pink-200"
                                                        : "hover:bg-white/80"
                                                        }`}
                                                >
                                                    {sticker.emoji}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>

                    <div className="space-y-2 mt-2">
                        <label className="text-sm font-bold ml-1 text-muted-foreground">你的名字</label>
                        <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="輸入你的名字..."
                            className="text-lg py-6 rounded-xl border-2 border-gray-200 focus-visible:ring-[hsl(var(--macaron-blue))]"
                        />
                    </div>

                    <DialogFooter className="mt-2">
                        <Button
                            onClick={handleSave}
                            className="w-full btn-macaron btn-blue text-lg py-6 rounded-xl"
                        >
                            完成設定
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
