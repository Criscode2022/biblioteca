import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Filters } from "./types";

interface FiltroLibrosProps {
  filtros: Filters;
  setFiltros: Dispatch<SetStateAction<Filters>>;
}

const EMPTY_FILTERS: Filters = {
  query: "",
  titulo: "",
  autor: "",
  year: null,
  editorial: "",
};

const FiltroLibros = ({ filtros, setFiltros }: FiltroLibrosProps) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const hasAdvancedFilters = Boolean(
    filtros.titulo || filtros.autor || filtros.year || filtros.editorial,
  );

  const hasActiveFilters = Boolean(
    filtros.query.trim() || hasAdvancedFilters,
  );

  useEffect(() => {
    if (hasAdvancedFilters) setAdvancedOpen(true);
  }, [hasAdvancedFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const finalValue = name === "year" ? (value === "" ? null : Number(value)) : value;
    setFiltros((prev) => ({ ...prev, [name]: finalValue }));
  };

  const clearFilters = () => {
    setFiltros(EMPTY_FILTERS);
    setAdvancedOpen(false);
  };

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-card sm:mb-6 sm:rounded-2xl sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
        <h2 className="text-xs font-semibold text-slate-700 sm:text-sm">Buscar</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 text-[10px] font-semibold text-brand-600 hover:text-brand-800 sm:text-xs"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="flex gap-1.5 sm:gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3.5 sm:h-4 sm:w-4" />
          <input
            id="filtro-query"
            type="search"
            name="query"
            value={filtros.query}
            onChange={handleChange}
            placeholder="Título, autor, editorial, año…"
            className="field pl-9 sm:pl-10"
            enterKeyHint="search"
          />
        </div>
        <button
          type="button"
          onClick={() => setAdvancedOpen((open) => !open)}
          aria-expanded={advancedOpen}
          aria-controls="filtros-avanzados"
          aria-label="Filtros avanzados"
          title="Filtros avanzados"
          className={`btn shrink-0 border px-2 sm:px-4 ${
            advancedOpen || hasAdvancedFilters
              ? "border-brand-300 bg-brand-50 text-brand-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <SlidersIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Filtros avanzados</span>
          {hasAdvancedFilters && !advancedOpen && (
            <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-brand-500" />
          )}
        </button>
      </div>

      {advancedOpen && (
        <div
          id="filtros-avanzados"
          className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:pt-4 lg:grid-cols-4"
        >
          <div>
            <label className="field-label" htmlFor="filtro-titulo">
              Título
            </label>
            <input
              id="filtro-titulo"
              placeholder="Buscar por título"
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
              Autor
            </label>
            <input
              id="filtro-autor"
              placeholder="Buscar por autor"
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
              Año
            </label>
            <input
              id="filtro-year"
              placeholder="Buscar por año"
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
              Editorial
            </label>
            <input
              id="filtro-editorial"
              placeholder="Buscar por editorial"
              className="field"
              type="text"
              name="editorial"
              value={filtros.editorial}
              onChange={handleChange}
              maxLength={30}
            />
          </div>
        </div>
      )}
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

const SlidersIcon = ({ className }: { className?: string }) => (
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
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

export default FiltroLibros;
