import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        signInAnonymously(auth).catch((error) => {
            console.error("Failed to sign in anonymously:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}
