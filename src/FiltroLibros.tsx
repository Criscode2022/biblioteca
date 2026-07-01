import type { Dispatch, SetStateAction } from "react";
import { useI18n } from "./i18n/I18nContext";
import type { Filters } from "./types";

interface FiltroLibrosProps {
  filtros: Filters;
  setFiltros: Dispatch<SetStateAction<Filters>>;
}

const FiltroLibros = ({ filtros, setFiltros }: FiltroLibrosProps) => {
  const { t } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const finalValue = name === "year" ? (value === "" ? null : Number(value)) : value;
    setFiltros((prev) => ({ ...prev, [name]: finalValue }));
  };

  const clearFilters = () =>
    setFiltros({ titulo: "", autor: "", year: null, editorial: "" });

  const hasActiveFilters = Boolean(
    filtros.titulo || filtros.autor || filtros.year || filtros.editorial,
  );

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SearchIcon className="h-4 w-4 text-brand-500" />
          {t("filters.title")}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800"
          >
            {t("filters.clear")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="field-label" htmlFor="filtro-titulo">
            {t("filters.bookTitle")}
          </label>
          <input
            id="filtro-titulo"
            placeholder={t("filters.bookTitlePlaceholder")}
            className="field"
            type="text"
            name="titulo"
            value={filtros.titulo}
            onChange={handleChange}
            maxLength={60}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="filtro-autor">
            {t("filters.author")}
          </label>
          <input
            id="filtro-autor"
            placeholder={t("filters.authorPlaceholder")}
            className="field"
            type="text"
            name="autor"
            value={filtros.autor}
            onChange={handleChange}
            maxLength={40}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="filtro-year">
            {t("filters.year")}
          </label>
          <input
            id="filtro-year"
            placeholder={t("filters.yearPlaceholder")}
            className="field"
            type="number"
            name="year"
            value={filtros.year ?? ""}
            onChange={handleChange}
            max={9999}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="filtro-editorial">
            {t("filters.publisher")}
          </label>
          <input
            id="filtro-editorial"
            placeholder={t("filters.publisherPlaceholder")}
            className="field"
            type="text"
            name="editorial"
            value={filtros.editorial}
            onChange={handleChange}
            maxLength={30}
          />
        </div>
      </div>
    </section>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default FiltroLibros;
