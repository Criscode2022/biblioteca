import { useState } from "react";
import { useAuth } from "./AuthContext";

type Tab = "signin" | "signup";

const AuthPanel = () => {
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
      setError("Introduce tu correo y contraseña.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = isSignup
      ? await signUp(email, password)
      : await signIn(email, password);
    setSubmitting(false);
    if (!result.ok) setError(result.error ?? "No se pudo completar la acción.");
    // On success the user becomes available and this panel unmounts.
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-slate-900">
        {isSignup ? "Crear cuenta" : "Iniciar sesión"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Accede para sincronizar tu biblioteca en la nube.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => switchTab("signin")}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            !isSignup ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => switchTab("signup")}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            isSignup ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
          }`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="auth-email">
            Correo electrónico
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            className="field"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="auth-password">
            Contraseña
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
            ? "Procesando…"
            : isSignup
              ? "Crear cuenta"
              : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default AuthPanel;
