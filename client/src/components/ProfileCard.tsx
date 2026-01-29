import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/use-user-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";

const AVATARS = ["😊", "🐶", "🐱", "🐰", "🦊", "🦁", "🐯", "🦄", "🦕", "🚀", "⭐", "🌈"];

export function ProfileCard() {
    const { profile, updateProfile } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [tempName, setTempName] = useState(profile.name);
    const [tempAvatar, setTempAvatar] = useState(profile.avatar);

    const handleOpen = () => {
        setTempName(profile.name);
        setTempAvatar(profile.avatar);
        setIsOpen(true);
    };

    const handleSave = () => {
        updateProfile(tempName, tempAvatar);
        setIsOpen(false);
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="bg-white/80 backdrop-blur-sm border-4 border-white rounded-3xl p-4 flex items-center gap-4 shadow-lg cursor-pointer max-w-sm mx-auto mb-8 hover:shadow-xl transition-all"
            >
                <div className="w-16 h-16 bg-[hsl(var(--macaron-blue))] rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-white">
                    {profile.avatar}
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
                <DialogContent className="sm:max-w-md border-4 border-[hsl(var(--macaron-blue))] rounded-3xl bg-white/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="font-display text-3xl text-center text-[hsl(var(--macaron-blue-dark))]">
                            設定你的檔案
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-muted-foreground">選擇一個頭像</label>
                            <div className="grid grid-cols-4 gap-2">
                                {AVATARS.map((avatar) => (
                                    <button
                                        key={avatar}
                                        onClick={() => setTempAvatar(avatar)}
                                        className={`text-3xl p-3 rounded-xl transition-all ${tempAvatar === avatar
                                                ? "bg-[hsl(var(--macaron-blue))] shadow-md scale-110 border-2 border-white"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {avatar}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-muted-foreground">你的名字</label>
                            <Input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder="輸入你的名字..."
                                className="text-lg py-6 rounded-xl border-2 border-gray-200 focus-visible:ring-[hsl(var(--macaron-blue))]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
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
