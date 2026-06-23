import Libro from "./Libro";
import type { Book } from "./types";

interface ListaLibrosProps {
  libros: Book[];
  deleteBook: (id: string) => void;
  hasActiveFilters: boolean;
}

const ListaLibros = ({ libros, deleteBook, hasActiveFilters }: ListaLibrosProps) => {
  if (libros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center sm:rounded-2xl sm:px-6 sm:py-16">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 sm:mb-4 sm:h-16 sm:w-16">
          {hasActiveFilters ? (
            <svg
              className="h-6 w-6 sm:h-8 sm:w-8"
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
              className="h-6 w-6 sm:h-8 sm:w-8"
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
        {hasActiveFilters ? (
          <>
            <h3 className="text-base font-semibold text-slate-700 sm:text-lg">Sin resultados</h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500 sm:text-sm">
              Ningún libro coincide con tu búsqueda. Prueba a ajustar o limpiar los
              filtros.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-base font-semibold text-slate-700 sm:text-lg">
              Tu biblioteca está vacía
            </h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500 sm:text-sm">
              Añade tu primer libro con el botón «Añadir libro».
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
      {libros.map((libro) => (
        <Libro key={libro.id} libro={libro} deleteBook={deleteBook} />
      ))}
    </div>
  );
};

export default ListaLibros;
