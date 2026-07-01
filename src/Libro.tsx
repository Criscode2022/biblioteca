import { SparklesIcon } from "./ai/BookAnalysisModal";
import { useI18n } from "./i18n/I18nContext";
import type { Book } from "./types";

interface LibroProps {
  libro: Book;
  deleteBook: (id: string) => void;
  /** Present only when AI is available (cloud mode, signed in). */
  onAnalyze?: (libro: Book) => void;
}

const Libro = ({ libro, deleteBook, onAnalyze }: LibroProps) => {
  const { t } = useI18n();
  const coverSrc =
    libro.imagen ||
    `https://placehold.co/700x800/4338ca/ffffff?text=${encodeURIComponent(libro.titulo)}`;

  return (
    <article className="group flex animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={t("book.coverAlt", { titulo: libro.titulo })}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          {libro.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-bold leading-tight text-slate-900">
          {libro.titulo}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-600">{libro.autor}</p>
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">{t("book.publisher")}:</span>{" "}
          {libro.editorial}
        </p>

        <div className="mt-4 flex gap-2">
          {onAnalyze && (
            <button
              onClick={() => onAnalyze(libro)}
              className="btn flex-1 bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white"
            >
              <SparklesIcon className="h-4 w-4" />
              {t("book.analyze")}
            </button>
          )}
          <button onClick={() => deleteBook(libro.id)} className="btn-danger flex-1">
            <TrashIcon className="h-4 w-4" />
            {t("book.delete")}
          </button>
        </div>
      </div>
    </article>
  );
};

const TrashIcon = ({ className }: { className?: string }) => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default Libro;
