import { PostgrestClient } from "@supabase/postgrest-js";
import type { Book, NewBook } from "../types";

/**
 * Storage abstraction shared by both modes. The UI only ever talks to this
 * interface, so swapping localStorage for the Neon Data API is transparent.
 */
export interface BooksRepository {
  list(): Promise<Book[]>;
  add(book: NewBook): Promise<Book>;
  remove(id: string): Promise<void>;
  /** Used by "import": wipes the collection and inserts the given books. */
  replaceAll(books: NewBook[]): Promise<Book[]>;
}

const STORAGE_KEY = "books";

/* ------------------------------------------------------------------ */
/* Offline repository (localStorage)                                   */
/* ------------------------------------------------------------------ */

export function createLocalRepository(): BooksRepository {
  const read = (): Book[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(parsed) ? (parsed as Book[]) : [];
    } catch {
      return [];
    }
  };

  const write = (books: Book[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

  return {
    async list() {
      return read();
    },
    async add(book) {
      const created: Book = { id: crypto.randomUUID(), ...book };
      write([...read(), created]);
      return created;
    },
    async remove(id) {
      write(read().filter((book) => book.id !== id));
    },
    async replaceAll(books) {
      const withIds: Book[] = books.map((book) => ({
        id: crypto.randomUUID(),
        ...book,
      }));
      write(withIds);
      return withIds;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Cloud repository (Neon Data API / PostgREST)                        */
/* ------------------------------------------------------------------ */

/** Minimal shape we need from a Neon Auth (Stack) user. */
export interface TokenProvider {
  getAuthJson(): Promise<{ accessToken: string | null }>;
}

interface BookRow {
  id: string;
  titulo: string;
  autor: string;
  year: number;
  editorial: string;
  imagen: string | null;
}

const COLUMNS = "id,titulo,autor,year,editorial,imagen";

const mapRow = (row: BookRow): Book => ({
  id: String(row.id),
  titulo: row.titulo,
  autor: row.autor,
  year: row.year,
  editorial: row.editorial,
  imagen: row.imagen ?? "",
});

export function createCloudRepository(
  dataApiUrl: string,
  user: TokenProvider,
): BooksRepository {
  // Every request is authenticated with the user's Neon Auth access token, so
  // the Data API's Row-Level Security only ever returns/operates on their rows.
  const client = new PostgrestClient(dataApiUrl, {
    fetch: async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const { accessToken } = await user.getAuthJson();
      const headers = new Headers(init.headers);
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
      return fetch(input, { ...init, headers });
    },
  });

  const table = () => client.from("books");

  return {
    async list() {
      const { data, error } = await table()
        .select(COLUMNS)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return ((data as BookRow[] | null) ?? []).map(mapRow);
    },
    async add(book) {
      const { data, error } = await table()
        .insert(book)
        .select(COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return mapRow(data as BookRow);
    },
    async remove(id) {
      const { error } = await table().delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    async replaceAll(books) {
      // Clear existing rows (RLS scopes this to the current user) then insert.
      const cleared = await table().delete().not("id", "is", null);
      if (cleared.error) throw new Error(cleared.error.message);
      if (books.length === 0) return [];
      const { data, error } = await table().insert(books).select(COLUMNS);
      if (error) throw new Error(error.message);
      return ((data as BookRow[] | null) ?? []).map(mapRow);
    },
  };
}
