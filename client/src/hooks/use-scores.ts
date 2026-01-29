import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { insertScoreSchema, type InsertScore, type Score } from "@/lib/types";

export function useScores(gameType: string) {
  return useQuery({
    queryKey: ["scores", gameType],
    queryFn: async () => {
      const q = query(
        collection(db, "scores"),
        where("gameType", "==", gameType),
        orderBy("score", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Score[];
    },
  });
}

export function useAddScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScore) => {
      const validated = insertScoreSchema.parse(data);
      const docRef = await addDoc(collection(db, "scores"), {
        ...validated,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...validated };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["scores", variables.gameType]
      });
    },
  });
}
