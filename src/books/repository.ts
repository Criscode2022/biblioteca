import type { NeonBooksClient } from "../lib/neon";
import type { Book, NewBook } from "../types";
import { readLocalBooks, writeLocalBooks } from "./localStorage";

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

/* ------------------------------------------------------------------ */
/* Offline repository (localStorage)                                   */
/* ------------------------------------------------------------------ */

export function createLocalRepository(): BooksRepository {
  return {
    async list() {
      return readLocalBooks();
    },
    async add(book) {
      const created: Book = { id: crypto.randomUUID(), ...book };
      writeLocalBooks([...readLocalBooks(), created]);
      return created;
    },
    async remove(id) {
      writeLocalBooks(readLocalBooks().filter((book) => book.id !== id));
    },
    async replaceAll(books) {
      const withIds: Book[] = books.map((book) => ({
        id: crypto.randomUUID(),
        ...book,
      }));
      writeLocalBooks(withIds);
      return withIds;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Cloud repository (Neon Data API)                                    */
/* ------------------------------------------------------------------ */

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

export function createCloudRepository(client: NeonBooksClient): BooksRepository {
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
      const cleared = await table().delete().not("id", "is", null);
      if (cleared.error) throw new Error(cleared.error.message);
      if (books.length === 0) return [];
      const { data, error } = await table().insert(books).select(COLUMNS);
      if (error) throw new Error(error.message);
      return ((data as BookRow[] | null) ?? []).map(mapRow);
    },
  };
}
