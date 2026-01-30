// Simple synthesizer instructions for kids songs
export type Note = {
    note: string; // e.g., "C4", "G4"
    duration: number; // in beats, e.g., 1, 0.5
    time?: number; // Calculated absolute time
};

export type Song = {
    id: string;
    title: string;
    bpm: number;
    melody: Note[];
};

const NOTE_FREQUENCIES: Record<string, number> = {
    "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "B3": 246.94,
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
    "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
};

export const SONGS: Song[] = [
    {
        id: "star",
        title: "小星星",
        bpm: 100,
        melody: [
            { note: "C4", duration: 1 }, { note: "C4", duration: 1 }, { note: "G4", duration: 1 }, { note: "G4", duration: 1 },
            { note: "A4", duration: 1 }, { note: "A4", duration: 1 }, { note: "G4", duration: 2 },
            { note: "F4", duration: 1 }, { note: "F4", duration: 1 }, { note: "E4", duration: 1 }, { note: "E4", duration: 1 },
            { note: "D4", duration: 1 }, { note: "D4", duration: 1 }, { note: "C4", duration: 2 },
        ]
    },
    {
        id: "tigers",
        title: "兩隻老虎",
        bpm: 120,
        melody: [
            { note: "C4", duration: 1 }, { note: "D4", duration: 1 }, { note: "E4", duration: 1 }, { note: "C4", duration: 1 },
            { note: "C4", duration: 1 }, { note: "D4", duration: 1 }, { note: "E4", duration: 1 }, { note: "C4", duration: 1 },
            { note: "E4", duration: 1 }, { note: "F4", duration: 1 }, { note: "G4", duration: 2 },
            { note: "E4", duration: 1 }, { note: "F4", duration: 1 }, { note: "G4", duration: 2 },
        ]
    }
];

export class AudioEngine {
    ctx: AudioContext | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    playTone(note: string, durationSec: number, time: number) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine"; // Soft tone
        osc.frequency.value = NOTE_FREQUENCIES[note] || 440;

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Envelope to avoid clicking
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + durationSec - 0.05);

        osc.start(time);
        osc.stop(time + durationSec);
    }

    resume() {
        this.ctx?.resume();
    }
}
