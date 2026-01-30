import { useState, useEffect } from 'react';
import useSound from 'use-sound';

// Keys for localStorage
const STREAK_KEY = 'kids-zone-streak';
const LAST_LOGIN_KEY = 'kids-zone-last-login';

export function useDailyStreak() {
    const [streak, setStreak] = useState(0);
    const [checkedInToday, setCheckedInToday] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    // Sound effects (using a placeholder generic sound or reusing existing context if verified)
    // Ideally, we import these from public folder or use the useSoundContext

    useEffect(() => {
        // Initial load from local storage
        const savedStreak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
        const lastLogin = localStorage.getItem(LAST_LOGIN_KEY);

        setStreak(savedStreak);

        if (lastLogin) {
            const today = new Date().toDateString();
            if (lastLogin === today) {
                setCheckedInToday(true);
            } else {
                // Check if streak is broken
                // Logic: if lastLogin was NOT yesterday, reset streak (unless streak is 0)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastLogin !== yesterday.toDateString() && savedStreak > 0) {
                    // Streak broken! But we don't reset immediately on load, 
                    // we usually reset when they attempt to check in or just display it as 0
                    // For simplicity/encouragement, let's keep it visible until they check in next?
                    // Actually, standard logic is to reset on load if missed.
                    // But let's be kind: check if MORE than 1 day passed.

                    const lastDate = new Date(lastLogin);
                    const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 2) { // 2 because >1 day gap means missed a day
                        setStreak(0);
                        localStorage.setItem(STREAK_KEY, '0');
                    }
                }
            }
        }
    }, []);

    const handleCheckIn = () => {
        if (checkedInToday) return;

        const today = new Date().toDateString();
        const newStreak = streak + 1;

        setStreak(newStreak);
        setCheckedInToday(true);
        setShowCelebration(true);

        localStorage.setItem(STREAK_KEY, newStreak.toString());
        localStorage.setItem(LAST_LOGIN_KEY, today);

        // Hide celebration after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000);

        return newStreak;
    };

    return {
        streak,
        checkedInToday,
        handleCheckIn,
        showCelebration,
        setShowCelebration
    };
}
