import { useEffect, useState } from "react";
import type { AuthUser } from "../auth/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { analyzeBook } from "../lib/ai";
import Modal from "../Modal";
import type { Book, BookAnalysis } from "../types";

interface BookAnalysisModalProps {
  book: Book | null;
  user: AuthUser;
  onClose: () => void;
}

const BookAnalysisModal = ({ book, user, onClose }: BookAnalysisModalProps) => {
  const { lang, t } = useI18n();
  const [analysis, setAnalysis] = useState<BookAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookId = book?.id ?? null;

  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;
    setAnalysis(null);
    setError(null);
    setLoading(true);
    analyzeBook(user, bookId, lang)
      .then((res) => {
        if (!cancelled) setAnalysis(res.analysis);
      })
      .catch(() => {
        if (!cancelled) setError(t("analysis.error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, lang, user]);

  const regenerate = async () => {
    if (!bookId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeBook(user, bookId, lang, true);
      setAnalysis(res.analysis);
    } catch {
      setError(t("analysis.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(book)}
      onClose={onClose}
      tone="light"
      maxWidthClassName="sm:max-w-2xl"
      panelClassName="bg-white p-6 sm:p-8"
    >
      {book && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              <SparklesIcon className="h-4 w-4" />
              {t("analysis.title")}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold leading-tight text-slate-900">
              {book.titulo}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {book.autor} · {book.year} · {book.editorial}
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-3 py-10 text-slate-500">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              <p className="text-sm font-medium">{t("analysis.loading")}</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              {error}
            </div>
          )}

          {analysis && !loading && (
            <>
              <section>
                <h3 className="field-label">{t("analysis.summary")}</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  {analysis.summary}
                </p>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="field-label">{t("analysis.genre")}</h3>
                  <p className="text-sm font-medium text-slate-800">
                    {analysis.genre}
                  </p>
                </section>
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="field-label">{t("analysis.audience")}</h3>
                  <p className="text-sm text-slate-700">{analysis.audience}</p>
                </section>
              </div>

              {analysis.themes?.length > 0 && (
                <section>
                  <h3 className="field-label">{t("analysis.themes")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.themes.map((theme) => (
                      <span
                        key={theme}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="field-label">{t("analysis.significance")}</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  {analysis.significance}
                </p>
              </section>

              {analysis.similarWorks?.length > 0 && (
                <section>
                  <h3 className="field-label">{t("analysis.similarWorks")}</h3>
                  <ul className="flex flex-col gap-2">
                    {analysis.similarWorks.map((work) => (
                      <li
                        key={`${work.titulo}-${work.autor}`}
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {work.titulo}{" "}
                          <span className="font-normal text-slate-500">
                            — {work.autor}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">{work.reason}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <button
                onClick={regenerate}
                className="btn-secondary self-start"
                disabled={loading}
              >
                <SparklesIcon className="h-4 w-4" />
                {t("analysis.regenerate")}
              </button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export const SparklesIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 3l1.9 5.7a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-2a2 2 0 0 0 1.3-1.3L12 3z" />
  </svg>
);

export default BookAnalysisModal;
