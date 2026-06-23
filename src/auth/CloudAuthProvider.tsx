import { useMemo } from "react";
import { neonClient } from "../lib/neon";
import { AuthContext, type AuthResult, type AuthState, type AuthUser } from "./AuthContext";

const toResult = (error: { message?: string } | null | undefined): AuthResult => {
  if (error) return { ok: false, error: error.message ?? "No se pudo completar la acción." };
  return { ok: true };
};

/**
 * Provided only when cloud mode is configured. Bridges Neon Auth hooks into our
 * app-wide AuthState.
 */
export const CloudAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const client = neonClient;
  if (!client) throw new Error("CloudAuthProvider requires a configured Neon client.");

  const session = client.auth.useSession();

  const value = useMemo<AuthState>(() => {
    const user: AuthUser | null = session.data?.user
      ? {
          id: session.data.user.id,
          primaryEmail: session.data.user.email ?? null,
          async signOut() {
            await client.auth.signOut();
          },
        }
      : null;

    return {
      cloudAvailable: true,
      loading: session.isPending,
      user,
      async signIn(email, password) {
        const result = await client.auth.signIn.email({ email, password });
        return toResult(result.error);
      },
      async signUp(email, password) {
        const result = await client.auth.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Usuario",
        });
        return toResult(result.error);
      },
      async signOut() {
        await client.auth.signOut();
      },
    };
  }, [client, session.data?.user, session.isPending]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
