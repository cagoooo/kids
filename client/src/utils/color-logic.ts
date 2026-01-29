export interface ColorItem {
    name: string;
    hex: string;
    id: string;
}

export const COLORS: ColorItem[] = [
    { name: "紅色", hex: "#FF6B6B", id: "red" },
    { name: "藍色", hex: "#4D96FF", id: "blue" },
    { name: "綠色", hex: "#6BCB77", id: "green" },
    { name: "黃色", hex: "#FFD93D", id: "yellow" },
    { name: "紫色", hex: "#9D4EDD", id: "purple" },
    { name: "橘色", hex: "#FF9F45", id: "orange" },
    { name: "粉紅色", hex: "#FF99CC", id: "pink" },
    { name: "棕色", hex: "#8D6E63", id: "brown" },
];

export interface ColorProblem {
    target: ColorItem;
    options: ColorItem[];
}

export function generateColorProblem(): ColorProblem {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];

    // Generate 3 distractors unique from target
    const distractors = COLORS.filter(c => c.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    // Combine and shuffle
    const options = [target, ...distractors].sort(() => 0.5 - Math.random());

    return { target, options };
}
