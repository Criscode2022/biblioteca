import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import FiltroLibros from "./FiltroLibros";
import FormularioLibros from "./FormularioLibros";
import ListaLibros from "./ListaLibros";
import Modal from "./Modal";
import type { Book, Filters } from "./types";

const STORAGE_KEY = "books";

const loadBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Book[]) : [];
  } catch {
    return [];
  }
};

const EMPTY_FILTERS: Filters = { titulo: "", autor: "", year: null, editorial: "" };

const App = () => {
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const filteredBooks = useMemo(
    () =>
      books.filter((libro) => {
        return (
          (filters.titulo
            ? libro.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
            : true) &&
          (filters.autor
            ? libro.autor.toLowerCase().includes(filters.autor.toLowerCase())
            : true) &&
          (filters.year ? Number(libro.year) === Number(filters.year) : true) &&
          (filters.editorial
            ? libro.editorial.toLowerCase().includes(filters.editorial.toLowerCase())
            : true)
        );
      }),
    [books, filters],
  );

  const hasActiveFilters = Boolean(
    filters.titulo || filters.autor || filters.year || filters.editorial,
  );

  const addBook = (
    titulo: string,
    autor: string,
    year: number,
    editorial: string,
    imagen: string,
  ) => {
    setBooks((existing) => [
      ...existing,
      { id: crypto.randomUUID(), titulo, autor, year, editorial, imagen },
    ]);
    setIsFormOpen(false);
  };

  const deleteBook = (id: string) => {
    setBooks((existing) => existing.filter((libro) => libro.id !== id));
  };

  const exportToExcel = () => {
    const formattedData = books.map(({ id: _id, imagen: _imagen, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Libros");
    XLSX.writeFile(workbook, "libros.xlsx");
  };

  const exportToJson = () => {
    const data = JSON.stringify(books, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(data)}`;
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = "books.json";
    link.click();
  };

  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result)) as unknown;
        if (Array.isArray(parsed)) {
          setBooks(parsed as Book[]);
        } else {
          alert("El archivo no contiene una lista de libros válida.");
        }
      } catch {
        alert("No se pudo leer el archivo. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file, "UTF-8");
    event.target.value = "";
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-3 py-6 sm:px-6 sm:py-10">
      <div className="overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur">
        {/* Header with background image (kept by request) */}
        <header className="app-header px-6 py-12 text-center sm:px-10 sm:py-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
            Tu colección personal
          </p>
          <h1 className="font-serif text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-7xl">
            Biblioteca
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-200 sm:text-base">
            Organiza, busca y exporta todos tus libros en un solo lugar.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur">
            <BookIcon className="h-4 w-4" />
            {books.length} {books.length === 1 ? "libro" : "libros"}
          </span>
        </header>

        {/* Main content */}
        <main className="min-w-0 p-5 sm:p-8">
          <FiltroLibros filtros={filters} setFiltros={setFilters} />

          <div className="mb-5 flex flex-wrap items-center gap-3">
            {hasActiveFilters && (
              <p className="text-sm font-medium text-slate-500">
                {filteredBooks.length}{" "}
                {filteredBooks.length === 1 ? "resultado" : "resultados"}
              </p>
            )}
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <button
                className="btn-primary hidden sm:inline-flex"
                onClick={() => setIsFormOpen(true)}
              >
                <PlusIcon className="h-4 w-4" /> Añadir libro
              </button>
              <button
                className="btn-secondary"
                onClick={exportToExcel}
                disabled={!books.length}
              >
                <DownloadIcon className="h-4 w-4" /> Excel
              </button>
              <button
                className="btn-secondary"
                onClick={exportToJson}
                disabled={!books.length}
              >
                <DownloadIcon className="h-4 w-4" /> Exportar JSON
              </button>
              <button
                className="btn-secondary"
                onClick={() => importInputRef.current?.click()}
              >
                <UploadIcon className="h-4 w-4" /> Importar JSON
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".json,application/json"
                onChange={importFromJson}
                className="hidden"
              />
            </div>
          </div>

          <ListaLibros
            libros={filteredBooks}
            deleteBook={deleteBook}
            hasActiveFilters={hasActiveFilters}
          />
        </main>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-400">
        Biblioteca · Hecho con React, TypeScript y Tailwind CSS
      </footer>

      {/* Add-book dialog */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        panelClassName="bg-gradient-to-br from-brand-700 to-brand-900 p-6 sm:p-8"
      >
        <FormularioLibros addLibro={addBook} />
      </Modal>

      {/* Mobile floating action button */}
      <button
        onClick={() => setIsFormOpen(true)}
        aria-label="Añadir libro"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-950/40 transition hover:bg-brand-700 active:scale-95 sm:hidden"
      >
        <PlusIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

const BookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default App;
