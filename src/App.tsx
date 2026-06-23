import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import AuthPanel from "./auth/AuthPanel";
import { useAuth } from "./auth/AuthContext";
import {
  createCloudRepository,
  createLocalRepository,
  type BooksRepository,
} from "./books/repository";
import { restoreLocalSnapshot, writeLocalBooks } from "./books/localStorage";
import { useBooks } from "./books/useBooks";
import { ChoiceDialog } from "./ConfirmDialog";
import FiltroLibros from "./FiltroLibros";
import FormularioLibros from "./FormularioLibros";
import ListaLibros from "./ListaLibros";
import Modal from "./Modal";
import { isCloudConfigured } from "./lib/config";
import { neonClient } from "./lib/neon";
import type { Filters, NewBook } from "./types";

const EMPTY_FILTERS: Filters = { titulo: "", autor: "", year: null, editorial: "" };

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
  const importInputRef = useRef<HTMLInputElement>(null);

  // The local repository is stable for the lifetime of the app.
  const localRepository = useMemo(() => createLocalRepository(), []);

  const repository = useMemo<BooksRepository | null>(() => {
    if (mode !== "cloud") return localRepository;
    if (!auth.user || !neonClient) return null;
    return createCloudRepository(neonClient);
  }, [mode, auth.user, localRepository]);

  const { books, loading, error, addBook, deleteBook, replaceBooks } =
    useBooks(repository);

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

  const handleAddBook = async (book: NewBook) => {
    await addBook(book); // throws on failure -> dialog stays open
    setIsFormOpen(false);
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
        if (!Array.isArray(parsed)) {
          alert("El archivo no contiene una lista de libros válida.");
          return;
        }
        // Strip ids so each backend assigns its own.
        const incoming: NewBook[] = parsed.map((b: Record<string, unknown>) => ({
          titulo: String(b.titulo ?? ""),
          autor: String(b.autor ?? ""),
          year: Number(b.year ?? 0),
          editorial: String(b.editorial ?? ""),
          imagen: String(b.imagen ?? ""),
        }));
        replaceBooks(incoming).catch(() => {
          /* error surfaced via the hook */
        });
      } catch {
        alert("No se pudo leer el archivo. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file, "UTF-8");
    event.target.value = "";
  };

  const signedOutCloud = mode === "cloud" && !auth.user;
  const showBooks = !signedOutCloud;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-3 py-6 sm:px-6 sm:py-10">
      <div className="overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur">
        {/* Header with background image (kept by request) */}
        <header className="app-header px-6 py-12 text-center sm:px-10 sm:py-16">
          {auth.cloudAvailable && (
            <div className="absolute right-3 top-3 flex items-center gap-2 sm:right-5 sm:top-5">
              <ModeToggle mode={mode} onChange={handleModeChange} />
              {mode === "cloud" && auth.user && (
                <AccountChip
                  email={auth.user.primaryEmail}
                  onSignOut={() => setLogoutDialogOpen(true)}
                />
              )}
            </div>
          )}

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

              {error && (
                <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
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

      <footer className="mt-6 text-center text-xs text-slate-400">
        Biblioteca · {mode === "cloud" ? "Modo nube (Neon)" : "Modo offline"} · React,
        TypeScript y Tailwind CSS
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
        primaryLabel="Guardar libros de la cuenta"
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
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-950/40 transition hover:bg-brand-700 active:scale-95 sm:hidden"
        >
          <PlusIcon className="h-7 w-7" />
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
  <div className="flex rounded-full bg-white/15 p-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
    {(["offline", "cloud"] as const).map((value) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`rounded-full px-3 py-1 transition ${
          mode === value ? "bg-white text-brand-700" : "text-white/90 hover:text-white"
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
  <div className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-3 pr-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur">
    <span className="hidden max-w-[10rem] truncate sm:inline">{email ?? "Cuenta"}</span>
    <button
      onClick={onSignOut}
      className="rounded-full bg-white/20 px-2.5 py-1 font-semibold transition hover:bg-white/30"
    >
      Salir
    </button>
  </div>
);

const Spinner = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
    <p className="text-sm font-medium">{label}</p>
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
