import { createContext, useContext } from "react";
import { es, type Lang, type TranslationKey } from "./translations";

export type TranslateFn = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

export interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslateFn;
}

export const LANG_STORAGE_KEY = "app-lang";

export const detectInitialLang = (): Lang => {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === "es" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
};

export const interpolate = (
  template: string,
  vars?: Record<string, string | number>,
): string =>
  vars
    ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      )
    : template;

// Default (never used in practice: the provider is always mounted).
export const I18nContext = createContext<I18nState>({
  lang: "es",
  setLang: () => {},
  t: (key, vars) => interpolate(es[key], vars),
});

export const useI18n = () => useContext(I18nContext);
