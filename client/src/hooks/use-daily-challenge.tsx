import React, { createContext, useContext, useState, useEffect } from "react";
import { DailyQuestion, generateDailyChallenge } from "@/utils/daily-generator";

interface DailyChallengeState {
    date: string;
    questions: DailyQuestion[];
    currentIndex: number;
    score: number;
    isCompleted: boolean;
    isStarted: boolean;
}

interface DailyChallengeContextType {
    state: DailyChallengeState;
    startChallenge: () => void;
    answerQuestion: (isCorrect: boolean) => void;
    resetChallenge: () => void; // For testing or admin
}

const DailyChallengeContext = createContext<DailyChallengeContextType | undefined>(undefined);

const STORAGE_KEY = "kidszone_daily_challenge";

export function DailyChallengeProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<DailyChallengeState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const today = new Date().toDateString();

        if (saved) {
            const parsed = JSON.parse(saved);
            // If it's the same day, return saved state
            if (parsed.date === today) {
                return parsed;
            }
        }

        // New day, new challenge (but don't generate questions yet until started to save memory/load)
        return {
            date: today,
            questions: [],
            currentIndex: 0,
            score: 0,
            isCompleted: false,
            isStarted: false
        };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const startChallenge = () => {
        if (state.isStarted && state.questions.length > 0) return;

        const questions = generateDailyChallenge();
        setState(prev => ({
            ...prev,
            questions,
            isStarted: true,
            currentIndex: 0,
            score: 0,
            isCompleted: false
        }));
    };

    const answerQuestion = (isCorrect: boolean) => {
        setState(prev => {
            const newScore = isCorrect ? prev.score + 20 : prev.score; // 5 questions, max 100
            const nextIndex = prev.currentIndex + 1;
            const isCompleted = nextIndex >= prev.questions.length;

            return {
                ...prev,
                score: newScore,
                currentIndex: nextIndex,
                isCompleted
            };
        });
    };

    const resetChallenge = () => {
        setState({
            date: new Date().toDateString(),
            questions: [],
            currentIndex: 0,
            score: 0,
            isCompleted: false,
            isStarted: false
        });
    };

    return (
        <DailyChallengeContext.Provider value={{ state, startChallenge, answerQuestion, resetChallenge }}>
            {children}
        </DailyChallengeContext.Provider>
    );
}

export function useDailyChallenge() {
    const context = useContext(DailyChallengeContext);
    if (context === undefined) {
        throw new Error("useDailyChallenge must be used within a DailyChallengeProvider");
    }
    return context;
}
