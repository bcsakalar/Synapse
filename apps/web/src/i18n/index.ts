import { en, type TranslationSchema } from "./en";
import { tr } from "./tr";

export type Language = "en" | "tr";

export const translations: Record<Language, TranslationSchema> = {
  en,
  tr,
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  tr: "Türkçe",
};

export type { TranslationSchema };

/**
 * Flat dot-notation key paths of the translation schema.
 * e.g. "common.signIn" | "landing.heroTitle1" | ...
 */
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Leaves<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? Join<K, Leaves<T[K]>> : K }[keyof T]
  : never;

export type TranslationKey = Leaves<TranslationSchema>;

/**
 * Get a translation value by dot-notation key.
 * e.g. t("common.signIn", "en") => "Sign In"
 */
export function getTranslation(key: string, lang: Language): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations[lang];
  for (const part of parts) {
    value = value?.[part];
  }
  if (typeof value === "string") return value;
  // Fallback to English
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fallback: any = translations.en;
  for (const part of parts) {
    fallback = fallback?.[part];
  }
  return typeof fallback === "string" ? fallback : key;
}
