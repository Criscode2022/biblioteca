export interface Book {
  id: string;
  titulo: string;
  autor: string;
  year: number;
  editorial: string;
  imagen: string;
}

/** A book that has not been persisted yet (no id). */
export type NewBook = Omit<Book, "id">;

export interface Filters {
  titulo: string;
  autor: string;
  year: number | null;
  editorial: string;
}

/* ------------------------------------------------------------------ */
/* AI (cloud mode)                                                     */
/* ------------------------------------------------------------------ */

export interface SimilarWork {
  titulo: string;
  autor: string;
  reason: string;
}

/** Structured analysis produced by the AI backend for a single book. */
export interface BookAnalysis {
  summary: string;
  genre: string;
  themes: string[];
  audience: string;
  significance: string;
  similarWorks: SimilarWork[];
}

export interface SemanticResult {
  id: string;
  titulo: string;
  autor: string;
  year: number;
  editorial: string;
  summary: string | null;
  similarity: number;
}

export interface AskSource {
  id: string;
  titulo: string;
  autor: string;
  similarity: number;
}
