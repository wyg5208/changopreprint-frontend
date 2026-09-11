"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="cp-footer">
      <div className="cp-container">
        <p>
          {t("footer_p1_before")}
          <strong>{t("footer_p1_strong")}</strong>
          {t("footer_p1_after")}
        </p>
        <p>{t("footer_p2")}</p>
        <p>
          {t("footer_p3_before")}
          <a href="https://zenodo.org" target="_blank" rel="noreferrer">
            Zenodo
          </a>
          {t("footer_p3_after")}
        </p>
        <p>{t("footer_p4")}</p>
      </div>
    </footer>
  );
}
