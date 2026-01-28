import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  gameType: text("game_type").notNull(), // 'color', 'math', 'english'
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  playerName: true,
  gameType: true,
  score: true,
});

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;
