import type { Book } from "./types";

interface LibroProps {
  libro: Book;
  deleteBook: (id: string) => void;
}

const Libro = ({ libro, deleteBook }: LibroProps) => {
  const coverSrc =
    libro.imagen ||
    `https://placehold.co/700x800/4338ca/ffffff?text=${encodeURIComponent(libro.titulo)}`;

  return (
    <article className="group flex animate-fade-in-up flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:rounded-2xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={coverSrc}
          alt={`Carátula de ${libro.titulo}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
          {libro.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-slate-900 sm:text-lg sm:leading-tight">
          {libro.titulo}
        </h3>
        <p className="mt-0.5 truncate text-xs font-medium text-brand-600 sm:mt-1 sm:text-sm">
          {libro.autor}
        </p>
        <p className="mt-1 truncate text-[10px] text-slate-500 sm:mt-2 sm:text-xs">
          <span className="font-semibold text-slate-600">Editorial:</span>{" "}
          {libro.editorial}
        </p>

        <button
          onClick={() => deleteBook(libro.id)}
          className="btn-danger mt-2 w-full sm:mt-4"
        >
          <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Eliminar
        </button>
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
