export interface WordItem {
    word: string;
    chinese: string;
    emoji: string;
}

export const WORDS: WordItem[] = [
    { word: "Apple", chinese: "蘋果", emoji: "🍎" },
    { word: "Dog", chinese: "狗", emoji: "🐶" },
    { word: "Cat", chinese: "貓", emoji: "🐱" },
    { word: "Car", chinese: "汽車", emoji: "🚗" },
    { word: "Ball", chinese: "球", emoji: "⚽" },
    { word: "Sun", chinese: "太陽", emoji: "☀️" },
    { word: "Book", chinese: "書", emoji: "📚" },
    { word: "Fish", chinese: "魚", emoji: "🐠" },
    { word: "Tree", chinese: "樹", emoji: "🌳" },
    { word: "House", chinese: "房子", emoji: "🏠" },
    { word: "Star", chinese: "星星", emoji: "⭐" },
    { word: "Moon", chinese: "月亮", emoji: "🌙" },
];

export interface EnglishProblem {
    target: WordItem;
    options: WordItem[];
    mode: "emoji-to-word" | "word-to-emoji";
}

export function generateEnglishProblem(): EnglishProblem {
    const target = WORDS[Math.floor(Math.random() * WORDS.length)];
    const mode = Math.random() > 0.5 ? "emoji-to-word" : "word-to-emoji";

    const distractors = WORDS.filter(w => w.word !== target.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const options = [target, ...distractors].sort(() => 0.5 - Math.random());

    return { target, options, mode };
}
