import { useCallback, useEffect, useState } from "react";
import type { Book, NewBook } from "../types";
import type { BooksRepository } from "./repository";

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Algo salió mal. Inténtalo de nuevo.";

export interface UseBooksResult {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (book: NewBook) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  replaceBooks: (books: NewBook[]) => Promise<void>;
}

/**
 * Owns the book list for the active repository. Passing `null` (e.g. cloud mode
 * while signed out) simply yields an empty, idle list.
 */
export function useBooks(repository: BooksRepository | null): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repository) {
      setBooks([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    repository
      .list()
      .then((result) => {
        if (!cancelled) setBooks(result);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repository]);

  const addBook = useCallback(
    async (book: NewBook) => {
      if (!repository) return;
      setError(null);
      try {
        const created = await repository.add(book);
        setBooks((prev) => [...prev, created]);
      } catch (e) {
        setError(errorMessage(e));
        throw e;
      }
    },
    [repository],
  );

  const deleteBook = useCallback(
    async (id: string) => {
      if (!repository) return;
      setError(null);
      let snapshot: Book[] = [];
      setBooks((prev) => {
        snapshot = prev;
        return prev.filter((book) => book.id !== id);
      });
      try {
        await repository.remove(id);
      } catch (e) {
        setError(errorMessage(e));
        setBooks(snapshot); // roll back the optimistic delete
      }
    },
    [repository],
  );

  const replaceBooks = useCallback(
    async (newBooks: NewBook[]) => {
      if (!repository) return;
      setError(null);
      try {
        setBooks(await repository.replaceAll(newBooks));
      } catch (e) {
        setError(errorMessage(e));
        throw e;
      }
    },
    [repository],
  );

  return { books, loading, error, addBook, deleteBook, replaceBooks };
}
