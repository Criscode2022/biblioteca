import type { AuthUser } from "../auth/AuthContext";
import type { AskSource, BookAnalysis, SemanticResult } from "../types";

/**
 * Client for the AI serverless endpoints (Netlify Functions under /api/*).
 * Every call is authenticated with the user's Neon Auth access token; the
 * OpenAI key never leaves the server.
 */
const post = async <T>(user: AuthUser, path: string, body: unknown): Promise<T> => {
  const { accessToken } = await user.getAuthJson();
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error;
    throw new Error(message ?? `Request failed (${res.status})`);
  }
  return data as T;
};

export const analyzeBook = (
  user: AuthUser,
  bookId: string,
  language: string,
  force = false,
) =>
  post<{ analysis: BookAnalysis; cached: boolean }>(user, "/api/analyze-book", {
    bookId,
    language,
    force,
  });

export const semanticSearch = (user: AuthUser, query: string, limit = 8) =>
  post<{ results: SemanticResult[] }>(user, "/api/semantic-search", {
    query,
    limit,
  });

export const askLibrary = (user: AuthUser, question: string, language: string) =>
  post<{ answer: string; sources: AskSource[] }>(user, "/api/ask-library", {
    question,
    language,
  });
