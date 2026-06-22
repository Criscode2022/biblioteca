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
