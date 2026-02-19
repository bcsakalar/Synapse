"use client";

import { useLanguage } from "@/contexts/language-context";
import { LANGUAGE_LABELS, type Language } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const { lang, setLang } = useLanguage();

  const toggle = () => {
    const next: Language = lang === "en" ? "tr" : "en";
    setLang(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="justify-start gap-2 px-3"
      title={`Switch to ${lang === "en" ? "Türkçe" : "English"}`}
    >
      <Languages className="w-4 h-4 shrink-0" />
      {!collapsed && (
        <span className="text-sm">{LANGUAGE_LABELS[lang]}</span>
      )}
    </Button>
  );
}
