import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { insertScoreSchema, type InsertScore, type Score } from "@/lib/types";

// Helper to simulate network delay for better UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage key
const SCORES_STORAGE_KEY = "kidszone_scores";

export function useScores(gameType: string) {
  return useQuery({
    queryKey: ["scores", gameType],
    queryFn: async () => {
      // Simulate network request
      await delay(500);

      try {
        const stored = localStorage.getItem(SCORES_STORAGE_KEY);
        const allScores: Score[] = stored ? JSON.parse(stored) : [];

        // Filter by gameType and sort by score desc
        return allScores
          .filter(s => s.gameType === gameType)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      } catch (e) {
        console.error("Failed to fetch scores from localStorage", e);
        return [];
      }
    },
  });
}

export function useAddScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScore) => {
      const validated = insertScoreSchema.parse(data);
      await delay(800); // Simulate network delay

      const newScore: Score = {
        id: Math.random().toString(36).slice(2),
        ...validated,
        createdAt: new Date(), // LocalStorage stores strings, but we'll cast it back on read if needed (though UI handles dates loosely usually)
      };

      try {
        const stored = localStorage.getItem(SCORES_STORAGE_KEY);
        const allScores: Score[] = stored ? JSON.parse(stored) : [];

        allScores.push(newScore);
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(allScores));

        return newScore;
      } catch (e) {
        console.error("Failed to save score to localStorage", e);
        throw e;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["scores", variables.gameType]
      });
    },
  });
}
