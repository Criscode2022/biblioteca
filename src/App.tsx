import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import AiAssistantModal from "./ai/AiAssistantModal";
import BookAnalysisModal, { SparklesIcon } from "./ai/BookAnalysisModal";
import AuthPanel from "./auth/AuthPanel";
import { useAuth } from "./auth/AuthContext";
import {
  createCloudRepository,
  createLocalRepository,
  type BooksRepository,
} from "./books/repository";
import { useBooks } from "./books/useBooks";
import FiltroLibros from "./FiltroLibros";
import FormularioLibros from "./FormularioLibros";
import { useI18n } from "./i18n/I18nContext";
import type { Lang } from "./i18n/translations";
import ListaLibros from "./ListaLibros";
import { cloudConfig, isCloudConfigured } from "./lib/config";
import Modal from "./Modal";
import PlansModal from "./PlansModal";
import type { Book, Filters, NewBook } from "./types";

const EMPTY_FILTERS: Filters = { titulo: "", autor: "", year: null, editorial: "" };

type Mode = "offline" | "cloud";
const MODE_KEY = "app-mode";

const initialMode = (): Mode => {
  if (!isCloudConfigured) return "offline";
  return localStorage.getItem(MODE_KEY) === "cloud" ? "cloud" : "offline";
};

const App = () => {
  const auth = useAuth();
  const { lang, setLang, t } = useI18n();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [analysisBook, setAnalysisBook] = useState<Book | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // The local repository is stable for the lifetime of the app.
  const localRepository = useMemo(() => createLocalRepository(), []);

  const repository = useMemo<BooksRepository | null>(() => {
    if (mode !== "cloud") return localRepository;
    if (!auth.user || !cloudConfig.dataApiUrl) return null;
    return createCloudRepository(cloudConfig.dataApiUrl, auth.user);
  }, [mode, auth.user, localRepository]);

  const { books, loading, error, addBook, deleteBook, replaceBooks } =
    useBooks(repository);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    localStorage.setItem(MODE_KEY, next);
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
          alert(t("import.invalid"));
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
        alert(t("import.readError"));
      }
    };
    reader.readAsText(file, "UTF-8");
    event.target.value = "";
  };

  const signedOutCloud = mode === "cloud" && !auth.user;
  const showBooks = !signedOutCloud;
  // AI needs the serverless backend + an authenticated cloud user.
  const aiActive = mode === "cloud" && Boolean(auth.user);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-3 py-6 sm:px-6 sm:py-10">
      <div className="overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur">
        {/* Header with background image (kept by request) */}
        <header className="app-header px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="absolute right-3 top-3 flex flex-wrap items-center justify-end gap-2 sm:right-5 sm:top-5">
            <LangToggle lang={lang} onChange={setLang} />
            {auth.cloudAvailable && (
              <>
                <ModeToggle mode={mode} onChange={handleModeChange} t={t} />
                {mode === "cloud" && auth.user && (
                  <AccountChip
                    email={auth.user.primaryEmail}
                    fallback={t("account.fallback")}
                    signOutLabel={t("account.signOut")}
                    onSignOut={() => auth.signOut()}
                  />
                )}
              </>
            )}
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">
            {t("header.kicker")}
          </p>
          <h1 className="font-serif text-5xl font-extrabold tracking-tight text-white drop-shadow sm:text-7xl">
            Biblioteca
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-200 sm:text-base">
            {t("header.subtitle")}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur">
            <BookIcon className="h-4 w-4" />
            {t(books.length === 1 ? "header.booksOne" : "header.booksMany", {
              n: books.length,
            })}
          </span>
        </header>

        {/* Main content */}
        <main className="min-w-0 p-5 sm:p-8">
          {signedOutCloud ? (
            auth.loading ? (
              <Spinner label={t("status.checkingSession")} />
            ) : (
              <AuthPanel />
            )
          ) : (
            <>
              <FiltroLibros filtros={filters} setFiltros={setFilters} />

              <div className="mb-5 flex flex-wrap items-center gap-3">
                {hasActiveFilters && (
                  <p className="text-sm font-medium text-slate-500">
                    {t(
                      filteredBooks.length === 1
                        ? "toolbar.resultsOne"
                        : "toolbar.resultsMany",
                      { n: filteredBooks.length },
                    )}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  <button
                    className="btn-primary hidden sm:inline-flex"
                    onClick={() => setIsFormOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4" /> {t("toolbar.addBook")}
                  </button>
                  {aiActive && (
                    <button
                      className="btn-secondary !border-brand-200 !text-brand-700"
                      onClick={() => setIsAssistantOpen(true)}
                    >
                      <SparklesIcon className="h-4 w-4" /> {t("toolbar.aiAssistant")}
                    </button>
                  )}
                  <button
                    className="btn-secondary"
                    onClick={exportToExcel}
                    disabled={!books.length}
                  >
                    <DownloadIcon className="h-4 w-4" /> {t("toolbar.excel")}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={exportToJson}
                    disabled={!books.length}
                  >
                    <DownloadIcon className="h-4 w-4" /> {t("toolbar.exportJson")}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => importInputRef.current?.click()}
                  >
                    <UploadIcon className="h-4 w-4" /> {t("toolbar.importJson")}
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
                <Spinner label={t("status.loadingLibrary")} />
              ) : (
                <ListaLibros
                  libros={filteredBooks}
                  deleteBook={deleteBook}
                  hasActiveFilters={hasActiveFilters}
                  onAnalyze={aiActive ? setAnalysisBook : undefined}
                />
              )}
            </>
          )}
        </main>
      </div>

      <footer className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
        <span>{t("footer.text")}</span>
        <span aria-hidden="true">·</span>
        <button
          onClick={() => setIsPlansOpen(true)}
          className="font-semibold text-slate-300 underline-offset-2 transition hover:text-white hover:underline"
        >
          {t("plans.link")}
        </button>
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

      {/* AI dialogs (cloud mode, signed in) */}
      {aiActive && auth.user && (
        <>
          <AiAssistantModal
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            user={auth.user}
          />
          <BookAnalysisModal
            book={analysisBook}
            user={auth.user}
            onClose={() => setAnalysisBook(null)}
          />
        </>
      )}

      <PlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        currentPlan={aiActive ? "pro" : "free"}
      />

      {/* Mobile floating action button */}
      {showBooks && (
        <button
          onClick={() => setIsFormOpen(true)}
          aria-label={t("fab.addBook")}
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

const LangToggle = ({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) => (
  <div className="flex rounded-full bg-white/15 p-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
    {(["es", "en"] as const).map((value) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`rounded-full px-2.5 py-1 uppercase transition ${
          lang === value ? "bg-white text-brand-700" : "text-white/90 hover:text-white"
        }`}
      >
        {value}
      </button>
    ))}
  </div>
);

const ModeToggle = ({
  mode,
  onChange,
  t,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  t: (key: "mode.offline" | "mode.cloud") => string;
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
        {value === "offline" ? t("mode.offline") : t("mode.cloud")}
      </button>
    ))}
  </div>
);

const AccountChip = ({
  email,
  fallback,
  signOutLabel,
  onSignOut,
}: {
  email: string | null;
  fallback: string;
  signOutLabel: string;
  onSignOut: () => void;
}) => (
  <div className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-3 pr-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur">
    <span className="hidden max-w-[10rem] truncate sm:inline">{email ?? fallback}</span>
    <button
      onClick={onSignOut}
      className="rounded-full bg-white/20 px-2.5 py-1 font-semibold transition hover:bg-white/30"
    >
      {signOutLabel}
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
