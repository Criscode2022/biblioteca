import { useState } from "react";
import type { AuthUser } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { askLibrary, semanticSearch } from "../lib/ai";
import Modal from "../Modal";
import type { AskSource, SemanticResult } from "../types";
import { SparklesIcon } from "./BookAnalysisModal";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
}

type Tab = "ask" | "search";

const AiAssistantModal = ({ isOpen, onClose, user }: AiAssistantModalProps) => {
  const { lang, t } = useI18n();
  const [tab, setTab] = useState<Tab>("ask");

  // Ask (RAG)
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<AskSource[]>([]);
  const [asking, setAsking] = useState(false);

  // Semantic search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || asking) return;
    setAsking(true);
    setError(null);
    setAnswer(null);
    setSources([]);
    try {
      const res = await askLibrary(user, q, lang);
      setAnswer(res.answer);
      setSources(res.sources);
    } catch {
      setError(t("analysis.error"));
    } finally {
      setAsking(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || searching) return;
    setSearching(true);
    setError(null);
    setResults(null);
    try {
      const res = await semanticSearch(user, q);
      setResults(res.results);
    } catch {
      setError(t("analysis.error"));
    } finally {
      setSearching(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      tone="light"
      maxWidthClassName="sm:max-w-2xl"
      panelClassName="bg-white p-6 sm:p-8"
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
            <SparklesIcon className="h-4 w-4" />
            {t("ai.title")}
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
            {t("ai.subtitle")}
          </h2>
          <p className="mt-1 text-xs text-slate-400">{t("ai.onlyAnalyzed")}</p>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(["ask", "search"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value);
                setError(null);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                tab === value ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
              }`}
            >
              {value === "ask" ? t("ai.tab.ask") : t("ai.tab.search")}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        {tab === "ask" ? (
          <div className="flex flex-col gap-4">
            <form onSubmit={handleAsk} className="flex flex-col gap-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t("ai.askPlaceholder")}
                rows={3}
                maxLength={2000}
                className="field resize-none"
              />
              <button
                type="submit"
                className="btn-primary self-end"
                disabled={asking || !question.trim()}
              >
                {asking ? t("ai.thinking") : t("ai.askButton")}
              </button>
            </form>

            {asking && <PulseRows />}

            {answer && !asking && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {answer}
                </p>
                {sources.length > 0 && (
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <h3 className="field-label">{t("ai.sources")}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {sources.map((s) => (
                        <li
                          key={s.id}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                          title={`${Math.round(s.similarity * 100)}% ${t("ai.match")}`}
                        >
                          {s.titulo} — {s.autor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("ai.searchPlaceholder")}
                maxLength={300}
                className="field"
              />
              <button
                type="submit"
                className="btn-primary shrink-0"
                disabled={searching || !query.trim()}
              >
                {searching ? t("ai.searching") : t("ai.searchButton")}
              </button>
            </form>

            {searching && <PulseRows />}

            {results && !searching && (
              <ul className="flex flex-col gap-2">
                {results.length === 0 && (
                  <li className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                    {t("ai.noMatches")}
                  </li>
                )}
                {results.map((r) => (
                  <li key={r.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {r.titulo}
                        </p>
                        <p className="text-xs text-slate-500">
                          {r.autor} · {r.year} · {r.editorial}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                        {Math.round(r.similarity * 100)}%
                      </span>
                    </div>
                    {r.summary && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                        {r.summary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

const PulseRows = () => (
  <div className="flex flex-col gap-2" aria-hidden="true">
    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
  </div>
);

export default AiAssistantModal;
