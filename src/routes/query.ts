import { Router } from "express";
import { z } from "zod";
import { retrieve } from "../services/rag";
import { synthesizeAnswer } from "../services/llm";

const router = Router();

const querySchema = z.object({
  query: z.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const { query } = querySchema.parse(req.body);

    const relevantDocs = await retrieve(query);
    const answer = await synthesizeAnswer(query, relevantDocs);

    res.json({ answer, sources: relevantDocs.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

export { router as queryRouter };
