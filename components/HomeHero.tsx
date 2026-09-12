"use client";

// 首页 Hero：参考 bioRxiv/OSF Preprints 等预印本平台首页的常见结构
// （大标题 + 搜索框 + 主要行动按钮），用本站现有的卡片化视觉风格实现，
// 不引入新的 CSS 框架。搜索框是原生 GET 表单，不需要额外 JS 即可工作。
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="cp-hero">
      <h1 className="cp-hero-title">{t("hero_title")}</h1>
      <p className="cp-hero-subtitle">{t("hero_subtitle")}</p>

      <form action="/" method="GET" className="cp-hero-search">
        <input
          type="text"
          name="q"
          placeholder={t("hero_search_placeholder")}
          aria-label={t("hero_search_placeholder")}
        />
        <button type="submit">{t("hero_search_button")}</button>
      </form>

      <div className="cp-hero-cta">
        <Link href="/submit" className="cp-btn">
          {t("hero_cta_submit")}
        </Link>
        <Link href="/showcase" className="cp-btn secondary">
          {t("hero_cta_showcase")}
        </Link>
      </div>
    </section>
  );
}
