import { pipeline } from "@xenova/transformers";
import { cosineSimilarity } from "./utils";

let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

interface DocumentChunk {
  text: string;
  embedding: number[];
  source: string;
}

let documentStore: DocumentChunk[] = [];

export async function embedAndStore(
  text: string,
  source: string
): Promise<void> {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Invalid text content provided for embedding");
  }

  const chunks = splitText(text, 1000); // Simple chunking

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    documentStore.push({ text: chunk, embedding, source });
  }
}

export async function retrieve(
  query: string,
  topK: number = 5
): Promise<string[]> {
  const queryEmbedding = await getEmbedding(query);
  const similarities = documentStore.map((doc, index) => ({
    index,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, topK).map((s) => documentStore[s.index].text);
}

async function getEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

function splitText(text: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
