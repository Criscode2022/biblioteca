import OpenAI from "openai";
import { HttpError } from "./http";

export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";
export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new HttpError(500, "OPENAI_API_KEY is not configured");
  }
  client ??= new OpenAI();
  return client;
}

/** Embeds text and returns a pgvector literal like "[0.1,0.2,...]". */
export async function embed(text: string): Promise<string> {
  const res = await getOpenAI().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000),
  });
  return `[${res.data[0].embedding.join(",")}]`;
}

export const languageName = (lang: string) =>
  lang === "en" ? "English" : "Spanish";

/** Normalizes a client-provided language to the two supported UI locales. */
export const normalizeLang = (lang: unknown): "es" | "en" =>
  lang === "en" ? "en" : "es";
