"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageToggle from "./LanguageToggle";
import UserMenu from "./UserMenu";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="cp-header">
      <div className="cp-container">
        <Link href="/" className="cp-brand">
          ChangoPreprint
        </Link>
        <nav className="cp-nav">
          <Link href="/">{t("nav_browse")}</Link>
          <Link href="/submit">{t("nav_submit")}</Link>
          <UserMenu />
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
