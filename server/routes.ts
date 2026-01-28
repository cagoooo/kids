import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.scores.list.path, async (req, res) => {
    const gameType = req.params.gameType;
    const topScores = await storage.getTopScores(gameType);
    res.json(topScores);
  });

  app.post(api.scores.create.path, async (req, res) => {
    try {
      const input = api.scores.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

// Optional seed function if you want to prepopulate high scores
async function seedDatabase() {
  const existingScores = await storage.getTopScores('math');
  if (existingScores.length === 0) {
    await storage.createScore({ playerName: "Star", gameType: "math", score: 100 });
    await storage.createScore({ playerName: "Moon", gameType: "color", score: 150 });
    await storage.createScore({ playerName: "Sun", gameType: "english", score: 120 });
  }
}

// Call seed in background
seedDatabase().catch(console.error);
