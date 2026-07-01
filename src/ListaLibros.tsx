import { useI18n } from "./i18n/I18nContext";
import Libro from "./Libro";
import type { Book } from "./types";

interface ListaLibrosProps {
  libros: Book[];
  deleteBook: (id: string) => void;
  hasActiveFilters: boolean;
  /** Present only when AI is available (cloud mode, signed in). */
  onAnalyze?: (libro: Book) => void;
}

const ListaLibros = ({
  libros,
  deleteBook,
  hasActiveFilters,
  onAnalyze,
}: ListaLibrosProps) => {
  const { t } = useI18n();

  if (libros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          {hasActiveFilters ? (
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          ) : (
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-700">
          {t(hasActiveFilters ? "empty.noResults.title" : "empty.noBooks.title")}
        </h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          {t(hasActiveFilters ? "empty.noResults.body" : "empty.noBooks.body")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {libros.map((libro) => (
        <Libro
          key={libro.id}
          libro={libro}
          deleteBook={deleteBook}
          onAnalyze={onAnalyze}
        />
      ))}
    </div>
  );
};

export default ListaLibros;
