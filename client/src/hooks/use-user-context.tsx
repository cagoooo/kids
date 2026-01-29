import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
    name: string;
    avatar: string; // Emoji character
}

interface UserContextType {
    profile: UserProfile;
    updateProfile: (name: string, avatar: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_AVATAR = "😊";

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem("kidszone_user");
        return saved ? JSON.parse(saved) : { name: "", avatar: DEFAULT_AVATAR };
    });

    useEffect(() => {
        localStorage.setItem("kidszone_user", JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (name: string, avatar: string) => {
        setProfile({ name, avatar });
    };

    return (
        <UserContext.Provider value={{ profile, updateProfile }}>
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
