import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function synthesizeAnswer(
  query: string,
  documents: string[]
): Promise<string> {
  const context = documents.join("\n\n");

  const prompt = `Using these documents, answer the user's question succinctly.\n\nDocuments:\n${context}\n\nQuestion: ${query}\n\nAnswer:`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content || "No answer generated";
}
