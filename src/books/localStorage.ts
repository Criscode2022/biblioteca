import type { Book, NewBook } from "../types";

const STORAGE_KEY = "books";
const SNAPSHOT_KEY = "books-pre-cloud-snapshot";

export function readLocalBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Book[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function hasLocalBooks(): boolean {
  return readLocalBooks().length > 0;
}

/** Preserve the current local library before a cloud sign-in or sign-up. */
export function saveLocalSnapshot() {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(readLocalBooks()));
}

export function restoreLocalSnapshot() {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    writeLocalBooks(Array.isArray(parsed) ? (parsed as Book[]) : []);
  } catch {
    writeLocalBooks([]);
  }
}

export function toNewBooks(books: Book[]): NewBook[] {
  return books.map(({ id: _id, ...book }) => book);
}
