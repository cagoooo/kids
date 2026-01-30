import React, { createContext, useContext, useState, useEffect } from "react";

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playClick: () => void;
    playCorrect: () => void;
    playWrong: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem("kidszone_muted");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem("kidszone_muted", JSON.stringify(isMuted));
    }, [isMuted]);

    // Mobile Audio Unlock
    useEffect(() => {
        const unlockAudio = () => {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                // Create a silent buffer to wake up the audio engine
                const buffer = ctx.createBuffer(1, 1, 22050);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start(0);
            }
        };

        document.addEventListener('touchstart', unlockAudio, { once: true });
        document.addEventListener('click', unlockAudio, { once: true });
        return () => {
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('click', unlockAudio);
        };
    }, []);

    const toggleMute = () => setIsMuted(!isMuted);

    // Placeholder sound functions - in a real app, these would play audio files
    // We can use the Web Audio API or HTML5 Audio here later
    const playTone = (type: "sine" | "sawtooth", freq: number, duration: number, endFreq?: number) => {
        if (isMuted) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            if (endFreq) {
                osc.frequency.setValueAtTime(endFreq, ctx.currentTime + 0.1);
            }

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Silently fail on audio errors to prevent crash
            console.warn("Audio play failed", e);
        }
    };

    const playClick = () => playTone("sine", 440, 0.1);

    const playCorrect = () => {
        if (isMuted) return;
        playTone("sine", 523.25, 0.3, 659.25); // C5 -> E5 sequence simulated poorly here, but good enough for now
    };

    const playWrong = () => playTone("sawtooth", 200, 0.3);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playClick, playCorrect, playWrong }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
}
