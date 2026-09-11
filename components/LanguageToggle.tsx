"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      type="button"
      className="cp-lang-toggle"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      aria-label="Switch language / 切换语言"
      title={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
