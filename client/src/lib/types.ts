import { z } from "zod";

export const gameTypes = [
    'color', 'math', 'english', 'shape', 'melody', 'clock', 'bopomofo', 'emotion',
    'coding', 'garden', 'market', 'recycle', 'memory', 'animal', 'traffic', 'body',
    'food', 'job', 'puzzle', 'difference', 'sequence', 'sorting'
] as const;

export const insertScoreSchema = z.object({
    playerName: z.string().min(1, "名字不能為空"),
    gameType: z.enum(gameTypes),
    score: z.number(),
});

export type InsertScore = z.infer<typeof insertScoreSchema>;

export interface Score extends InsertScore {
    id: string;
    createdAt: any;
}
