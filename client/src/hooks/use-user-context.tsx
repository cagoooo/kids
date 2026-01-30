import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
    name: string;
    avatar: string; // Emoji character
    decorationId?: number | null; // Sticker ID for decoration
    coins: number;
    unlockedAvatars: string[];
}

interface UserContextType {
    profile: UserProfile;
    updateProfile: (name: string, avatar: string, decorationId?: number | null) => void;
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    unlockAvatar: (avatar: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_AVATAR = "😊";
const DEFAULT_UNLOCKED_AVATARS = ["😊", "👦", "👧", "🐶", "🐱"];

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem("kidszone_user");
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration for existing users
            return {
                ...parsed,
                coins: parsed.coins ?? 0,
                unlockedAvatars: parsed.unlockedAvatars ?? DEFAULT_UNLOCKED_AVATARS
            };
        }
        return {
            name: "",
            avatar: DEFAULT_AVATAR,
            decorationId: null,
            coins: 0,
            unlockedAvatars: DEFAULT_UNLOCKED_AVATARS
        };
    });

    useEffect(() => {
        localStorage.setItem("kidszone_user", JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (name: string, avatar: string, decorationId?: number | null) => {
        setProfile(prev => ({ ...prev, name, avatar, decorationId }));
    };

    const addCoins = (amount: number) => {
        setProfile(prev => ({ ...prev, coins: prev.coins + amount }));
    };

    const spendCoins = (amount: number): boolean => {
        if (profile.coins >= amount) {
            setProfile(prev => ({ ...prev, coins: prev.coins - amount }));
            return true;
        }
        return false;
    };

    const unlockAvatar = (avatar: string) => {
        if (!profile.unlockedAvatars.includes(avatar)) {
            setProfile(prev => ({ ...prev, unlockedAvatars: [...prev.unlockedAvatars, avatar] }));
        }
    };

    return (
        <UserContext.Provider value={{ profile, updateProfile, addCoins, spendCoins, unlockAvatar }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
