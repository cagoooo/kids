export type CardType = 'image' | 'text';

export interface MemoryCardConfig {
    pairId: string; // Unique ID for the pair (e.g., "lion")
    items: [
        { content: string; type: CardType },
        { content: string; type: CardType }
    ];
}

export interface LevelConfig {
    id: number;
    name: string;
    description: string;
    pairs: MemoryCardConfig[];
}

export const MEMORY_LEVELS: LevelConfig[] = [
    {
        id: 1,
        name: "圖案配對",
        description: "找出一樣的圖案！",
        pairs: [
            { pairId: "rabbit", items: [{ content: "🐰", type: 'image' }, { content: "🐰", type: 'image' }] },
            { pairId: "bear", items: [{ content: "🐻", type: 'image' }, { content: "🐻", type: 'image' }] },
            { pairId: "fox", items: [{ content: "🦊", type: 'image' }, { content: "🦊", type: 'image' }] },
            { pairId: "panda", items: [{ content: "🐼", type: 'image' }, { content: "🐼", type: 'image' }] },
            { pairId: "koala", items: [{ content: "🐨", type: 'image' }, { content: "🐨", type: 'image' }] },
            { pairId: "lion", items: [{ content: "🦁", type: 'image' }, { content: "🦁", type: 'image' }] },
            { pairId: "tiger", items: [{ content: "🐯", type: 'image' }, { content: "🐯", type: 'image' }] },
            { pairId: "frog", items: [{ content: "🐸", type: 'image' }, { content: "🐸", type: 'image' }] },
        ]
    },
    {
        id: 2,
        name: "單字學習",
        description: "圖案對應文字",
        pairs: [
            { pairId: "rabbit", items: [{ content: "🐰", type: 'image' }, { content: "兔子", type: 'text' }] },
            { pairId: "bear", items: [{ content: "🐻", type: 'image' }, { content: "熊", type: 'text' }] },
            { pairId: "fox", items: [{ content: "🦊", type: 'image' }, { content: "狐狸", type: 'text' }] },
            { pairId: "panda", items: [{ content: "🐼", type: 'image' }, { content: "熊貓", type: 'text' }] },
            { pairId: "koala", items: [{ content: "🐨", type: 'image' }, { content: "無尾熊", type: 'text' }] },
            { pairId: "lion", items: [{ content: "🦁", type: 'image' }, { content: "獅子", type: 'text' }] },
            { pairId: "tiger", items: [{ content: "🐯", type: 'image' }, { content: "老虎", type: 'text' }] },
            { pairId: "frog", items: [{ content: "🐸", type: 'image' }, { content: "青蛙", type: 'text' }] },
        ]
    },
    {
        id: 3,
        name: "數學挑戰",
        description: "算式對應答案",
        pairs: [
            { pairId: "m1", items: [{ content: "1 + 1", type: 'text' }, { content: "2", type: 'text' }] },
            { pairId: "m2", items: [{ content: "2 + 2", type: 'text' }, { content: "4", type: 'text' }] },
            { pairId: "m3", items: [{ content: "5 - 2", type: 'text' }, { content: "3", type: 'text' }] },
            { pairId: "m4", items: [{ content: "3 + 3", type: 'text' }, { content: "6", type: 'text' }] },
            { pairId: "m5", items: [{ content: "10 - 5", type: 'text' }, { content: "5", type: 'text' }] },
            { pairId: "m6", items: [{ content: "8 + 0", type: 'text' }, { content: "8", type: 'text' }] },
            { pairId: "m7", items: [{ content: "4 + 3", type: 'text' }, { content: "7", type: 'text' }] },
            { pairId: "m8", items: [{ content: "9 - 0", type: 'text' }, { content: "9", type: 'text' }] },
        ]
    }
];
