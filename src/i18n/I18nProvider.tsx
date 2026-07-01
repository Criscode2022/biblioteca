import { useCallback, useEffect, useMemo, useState } from "react";
import {
  detectInitialLang,
  I18nContext,
  interpolate,
  LANG_STORAGE_KEY,
  type I18nState,
  type TranslateFn,
} from "./I18nContext";
import { translations, type Lang } from "./translations";

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(LANG_STORAGE_KEY, next);
  }, []);

  const t = useCallback<TranslateFn>(
    (key, vars) => interpolate(translations[lang][key], vars),
    [lang],
  );

  const value = useMemo<I18nState>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
