"use client";

// 极简 i18n Provider：纯 Context + localStorage，不引入 next-intl 之类的
// 路由(locale)方案 —— 落地页 /p/[slug] 的 URL 已被 Google Scholar 收录，
// 换 URL 结构风险太大。语言切换只影响客户端渲染文案，不改变路由。
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, type Locale } from "./dictionary";

const STORAGE_KEY = "cp_locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const dict = dictionaries[locale] || dictionaries.zh;
  let text = dict[key] ?? dictionaries.zh[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  // 首次挂载时读取用户上次选择的语言（SSR 阶段固定输出中文，不受影响）
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") {
        setLocaleState(saved);
      }
    } catch {
      // localStorage 不可用（如隐私模式），忽略，保持默认中文
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // 忽略
    }
  }

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() 必须在 <LanguageProvider> 内部使用");
  }
  return ctx;
}
