import { createContext, useContext } from "react";

export interface AuthUser {
  id: string;
  primaryEmail: string | null;
  signOut(): Promise<void>;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export interface AuthState {
  /** True only when cloud mode is configured at build time. */
  cloudAvailable: boolean;
  /** Auth is still resolving (e.g. restoring a session). */
  loading: boolean;
  user: AuthUser | null;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
}

export const offlineDefault: AuthState = {
  cloudAvailable: false,
  loading: false,
  user: null,
  async signIn() {
    return { ok: false, error: "El modo nube no está disponible." };
  },
  async signUp() {
    return { ok: false, error: "El modo nube no está disponible." };
  },
  async signOut() {},
};

export const AuthContext = createContext<AuthState>(offlineDefault);

export const useAuth = () => useContext(AuthContext);
