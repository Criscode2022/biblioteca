import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useAuth } from "./auth/AuthContext";
import AuthPanel from "./auth/AuthPanel";
import { restoreLocalSnapshot, writeLocalBooks } from "./books/localStorage";
import {
  createCloudRepository,
  createLocalRepository,
  type BooksRepository,
} from "./books/repository";
import { useBooks } from "./books/useBooks";
import { ChoiceDialog } from "./ConfirmDialog";
import FiltroLibros from "./FiltroLibros";
import FormularioLibros from "./FormularioLibros";
import { isCloudConfigured } from "./lib/config";
import { neonClient } from "./lib/neon";
import ListaLibros from "./ListaLibros";
import Modal from "./Modal";
import type { Filters, NewBook } from "./types";

const EMPTY_FILTERS: Filters = {
  query: "",
  titulo: "",
  autor: "",
  year: null,
  editorial: "",
};

type Mode = "offline" | "cloud";
const MODE_KEY = "app-mode";

const initialMode = (): Mode => {
  if (!isCloudConfigured) return "offline";
  return localStorage.getItem(MODE_KEY) === "cloud" ? "cloud" : "offline";
};

const App = () => {
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);

  // The local repository is stable for the lifetime of the app.
  const localRepository = useMemo(() => createLocalRepository(), []);

  const repository = useMemo<BooksRepository | null>(() => {
    if (mode !== "cloud") return localRepository;
    if (!auth.user || !neonClient) return null;
    return createCloudRepository(neonClient);
  }, [mode, auth.user, localRepository]);

  const { books, loading, error, addBook, deleteBook } = useBooks(repository);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    localStorage.setItem(MODE_KEY, next);
  };

  const syncLocalFromCloud = async () => {
    if (!neonClient) return;
    const cloudBooks = await createCloudRepository(neonClient).list();
    writeLocalBooks(cloudBooks);
  };

  const uploadLocalBooksToCloud = async (books: NewBook[]) => {
    if (!neonClient) return;
    const cloudRepo = createCloudRepository(neonClient);
    const uploaded = await cloudRepo.replaceAll(books);
    writeLocalBooks(uploaded);
  };

  const handleSignOutChoice = async (keepCloudBooks: boolean) => {
    setLogoutBusy(true);
    try {
      if (keepCloudBooks) {
        await syncLocalFromCloud();
      } else {
        restoreLocalSnapshot();
      }
      await auth.signOut();
      setLogoutDialogOpen(false);
    } catch {
      /* keep dialog open so the user can retry */
    } finally {
      setLogoutBusy(false);
    }
  };

  const filteredBooks = useMemo(
    () =>
      books.filter((libro) => {
        const query = filters.query.trim().toLowerCase();
        const matchesQuery =
          !query ||
          libro.titulo.toLowerCase().includes(query) ||
          libro.autor.toLowerCase().includes(query) ||
          libro.editorial.toLowerCase().includes(query) ||
          String(libro.year).includes(query);

        return (
          matchesQuery &&
          (filters.titulo
            ? libro.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
            : true) &&
          (filters.autor
            ? libro.autor.toLowerCase().includes(filters.autor.toLowerCase())
            : true) &&
          (filters.year ? Number(libro.year) === Number(filters.year) : true) &&
          (filters.editorial
            ? libro.editorial
                .toLowerCase()
                .includes(filters.editorial.toLowerCase())
            : true)
        );
      }),
    [books, filters],
  );

  const hasActiveFilters = Boolean(
    filters.query.trim() ||
    filters.titulo ||
    filters.autor ||
    filters.year ||
    filters.editorial,
  );

  const handleAddBook = async (book: NewBook) => {
    await addBook(book); // throws on failure -> dialog stays open
    setIsFormOpen(false);
  };

  const exportToExcel = () => {
    const formattedData = books.map(
      ({ id: _id, imagen: _imagen, ...rest }) => rest,
    );
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Libros");
    XLSX.writeFile(workbook, "libros.xlsx");
  };

  const signedOutCloud = mode === "cloud" && !auth.user;
  const showBooks = !signedOutCloud;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-2 py-3 sm:px-6 sm:py-10">
      <div className="overflow-hidden rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur sm:rounded-3xl">
        {/* Header with background image (kept by request) */}
        <header className="app-header px-4 py-8 text-center sm:px-10 sm:py-16">
          {auth.cloudAvailable && (
            <div className="absolute right-2 top-2 flex items-center gap-1.5 sm:right-5 sm:top-5 sm:gap-2">
              <ModeToggle mode={mode} onChange={handleModeChange} />
              {mode === "cloud" && auth.user && (
                <AccountChip
                  email={auth.user.primaryEmail}
                  onSignOut={() => setLogoutDialogOpen(true)}
                />
              )}
            </div>
          )}

          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-200 sm:mb-2 sm:text-xs sm:tracking-[0.35em]">
            Tu colección personal
          </p>
          <h1 className="app-header-title font-serif text-4xl font-bold tracking-tight text-white sm:text-7xl">
            Biblioteca
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-200 sm:mt-4 sm:text-base">
            Organiza, busca y exporta todos tus libros en un solo lugar.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur sm:mt-6 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm">
            <BookIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {books.length} {books.length === 1 ? "libro" : "libros"}
          </span>
        </header>

        {/* Main content */}
        <main className="min-w-0 p-3 sm:p-8">
          {signedOutCloud ? (
            auth.loading ? (
              <Spinner label="Comprobando tu sesión…" />
            ) : (
              <AuthPanel
                onSignInSuccess={syncLocalFromCloud}
                onSignUpWithLocalBooks={uploadLocalBooksToCloud}
              />
            )
          ) : (
            <>
              <FiltroLibros filtros={filters} setFiltros={setFilters} />

              <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                {hasActiveFilters && (
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    {filteredBooks.length}{" "}
                    {filteredBooks.length === 1 ? "resultado" : "resultados"}
                  </p>
                )}
                <div className="ml-auto flex flex-wrap gap-2">
                  <button
                    className="btn-primary hidden sm:inline-flex"
                    onClick={() => setIsFormOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4" /> Añadir libro
                  </button>
                  <button
                    type="button"
                    className="btn-secondary px-2.5 sm:px-4"
                    onClick={exportToExcel}
                    disabled={!books.length}
                    aria-label="Exportar a Excel"
                    title="Exportar a Excel"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Excel</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-200 sm:mb-4 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <Spinner label="Cargando tu biblioteca…" />
              ) : (
                <ListaLibros
                  libros={filteredBooks}
                  deleteBook={deleteBook}
                  hasActiveFilters={hasActiveFilters}
                />
              )}
            </>
          )}
        </main>
      </div>

      <footer className="mt-3 text-center text-[10px] text-slate-400 sm:mt-6 sm:text-xs">
        Biblioteca · {mode === "cloud" ? "Modo nube (Neon)" : "Modo offline"} ·
        React, TypeScript y Tailwind CSS
      </footer>

      {/* Add-book dialog */}
      {showBooks && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          panelClassName="bg-gradient-to-br from-brand-700 to-brand-900 p-6 sm:p-8"
        >
          <FormularioLibros addLibro={handleAddBook} />
        </Modal>
      )}

      <ChoiceDialog
        isOpen={logoutDialogOpen}
        title="¿Qué hacer con tus libros locales?"
        message="Al cerrar sesión puedes guardar los libros de tu cuenta en este dispositivo o recuperar la biblioteca local que tenías antes de conectarte."
        primaryLabel="Guardar libros de la cuenta online"
        secondaryLabel="Recuperar biblioteca local anterior"
        onPrimary={() => void handleSignOutChoice(true)}
        onSecondary={() => void handleSignOutChoice(false)}
        onCancel={() => setLogoutDialogOpen(false)}
        busy={logoutBusy}
      />

      {/* Mobile floating action button */}
      {showBooks && (
        <button
          onClick={() => setIsFormOpen(true)}
          aria-label="Añadir libro"
          className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-950/40 transition hover:bg-brand-700 active:scale-95 sm:hidden"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

const ModeToggle = ({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) => (
  <div className="flex rounded-full bg-white/15 p-0.5 text-[10px] font-semibold ring-1 ring-white/25 backdrop-blur sm:p-1 sm:text-xs">
    {(["offline", "cloud"] as const).map((value) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`rounded-full px-2 py-0.5 transition sm:px-3 sm:py-1 ${
          mode === value
            ? "bg-white text-brand-700"
            : "text-white/90 hover:text-white"
        }`}
      >
        {value === "offline" ? "Offline" : "Nube"}
      </button>
    ))}
  </div>
);

const AccountChip = ({
  email,
  onSignOut,
}: {
  email: string | null;
  onSignOut: () => void;
}) => (
  <div className="flex items-center gap-1 rounded-full bg-white/15 py-0.5 pl-2 pr-0.5 text-[10px] font-medium text-white ring-1 ring-white/25 backdrop-blur sm:gap-2 sm:py-1 sm:pl-3 sm:pr-1 sm:text-xs">
    <span className="hidden max-w-[10rem] truncate sm:inline">
      {email ?? "Cuenta"}
    </span>
    <button
      onClick={onSignOut}
      className="rounded-full bg-white/20 px-2 py-0.5 font-semibold transition hover:bg-white/30 sm:px-2.5 sm:py-1"
    >
      Salir
    </button>
  </div>
);

const Spinner = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-500 sm:gap-3 sm:py-16">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 sm:h-8 sm:w-8" />
    <p className="text-xs font-medium sm:text-sm">{label}</p>
  </div>
);

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

export default App;
