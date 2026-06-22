import { useMemo } from "react";
import { useUser } from "@stackframe/react";
import { stackClientApp } from "../lib/stack";
import { AuthContext, type AuthResult, type AuthState, type AuthUser } from "./AuthContext";

const toResult = (res: { status: string; error?: unknown }): AuthResult => {
  if (res.status === "error") {
    const error = res.error as { message?: string } | undefined;
    return { ok: false, error: error?.message ?? "No se pudo completar la acción." };
  }
  return { ok: true };
};

/**
 * Provided only when cloud mode is configured (mounted inside StackProvider).
 * Bridges Neon Auth's hooks into our app-wide AuthState.
 */
export const CloudAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // `useUser` returns `undefined` while loading, `null` when signed out.
  const user = useUser();

  const value = useMemo<AuthState>(
    () => ({
      cloudAvailable: true,
      loading: user === undefined,
      user: (user as AuthUser | null) ?? null,
      async signIn(email, password) {
        if (!stackClientApp) return { ok: false, error: "Cliente no inicializado." };
        return toResult(
          await stackClientApp.signInWithCredential({ email, password, noRedirect: true }),
        );
      },
      async signUp(email, password) {
        if (!stackClientApp) return { ok: false, error: "Cliente no inicializado." };
        return toResult(
          await stackClientApp.signUpWithCredential({ email, password, noRedirect: true }),
        );
      },
      async signOut() {
        await user?.signOut();
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
