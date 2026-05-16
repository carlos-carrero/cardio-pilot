"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import en, { type TranslationKey } from "./en";
import es from "./es";

// ── Supported languages ──────────────────────────────────────────

export type Language = "en" | "es";

const DICTIONARIES: Record<Language, Partial<Record<TranslationKey, string>>> = {
  en,
  es,
};

const STORAGE_KEY = "cardio_pilot_lang";

// ── Context ──────────────────────────────────────────────────────

interface TranslationContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "es") {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      // Try active language first, fall back to English
      const dict = DICTIONARIES[lang];
      const value = dict?.[key];
      if (value !== undefined && value !== "") return value;
      // English fallback
      return en[key] ?? key;
    },
    [lang],
  );

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    // Fallback for components that render TranslationProvider as a child
    return {
      lang: "en" as Language,
      setLang: (() => {}) as (lang: Language) => void,
      t: (key: TranslationKey) => en[key] ?? key,
    };
  }
  return ctx;
}
