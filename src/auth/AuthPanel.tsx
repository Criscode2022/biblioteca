import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useAuth } from "./AuthContext";

type Tab = "signin" | "signup";

const AuthPanel = () => {
  const { t } = useI18n();
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = tab === "signup";

  const switchTab = (next: Tab) => {
    setTab(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t("auth.errorMissing"));
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = isSignup
      ? await signUp(email, password)
      : await signIn(email, password);
    setSubmitting(false);
    if (!result.ok) setError(result.error ?? t("auth.errorGeneric"));
    // On success the user becomes available and this panel unmounts.
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-slate-900">
        {isSignup ? t("auth.title.signUp") : t("auth.title.signIn")}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{t("auth.subtitle")}</p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => switchTab("signin")}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            !isSignup ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
          }`}
        >
          {t("auth.signIn")}
        </button>
        <button
          type="button"
          onClick={() => switchTab("signup")}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            isSignup ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
          }`}
        >
          {t("auth.signUp")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="auth-email">
            {t("auth.email")}
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            className="field"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="auth-password">
            {t("auth.password")}
          </label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting
            ? t("auth.processing")
            : isSignup
              ? t("auth.submit.signUp")
              : t("auth.submit.signIn")}
        </button>
      </form>
    </div>
  );
};

export default AuthPanel;
