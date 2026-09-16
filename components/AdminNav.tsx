"use client";

// 仅管理员可见的顶部导航：金色胶囊按钮 + 下拉菜单
// （用户审批 / 稿件审核），角标显示当前待办总数。
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api, type AdminStats, type UserOut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function AdminNav() {
  const { t } = useLanguage();
  const [user, setUser] = useState<UserOut | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api
      .me(token)
      .then((res) => {
        setUser(res);
        if (res.is_admin) {
          return api.adminStats(token).then(setStats).catch(() => setStats(null));
        }
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  if (!user?.is_admin) return null;

  const badge = stats?.pending_total || 0;

  return (
    <div className="cp-admin-nav" ref={rootRef}>
      <button
        type="button"
        className="cp-admin-nav-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {t("nav_admin")}
        {badge > 0 && <span className="cp-admin-badge">{badge > 99 ? "99+" : badge}</span>}
      </button>
      {open && (
        <div className="cp-admin-dropdown">
          <Link href="/admin?tab=users" onClick={() => setOpen(false)}>
            <span className="cp-admin-dropdown-label">{t("nav_admin_users")}</span>
            <span className="cp-admin-dropdown-hint">{t("nav_admin_users_hint")}</span>
            {(stats?.pending_users || 0) > 0 && (
              <span className="cp-admin-badge inline">{stats?.pending_users}</span>
            )}
          </Link>
          <Link href="/admin?tab=papers" onClick={() => setOpen(false)}>
            <span className="cp-admin-dropdown-label">{t("nav_admin_papers")}</span>
            <span className="cp-admin-dropdown-hint">{t("nav_admin_papers_hint")}</span>
            {(stats?.pending_preprints || 0) + (stats?.pending_versions || 0) > 0 && (
              <span className="cp-admin-badge inline">
                {(stats?.pending_preprints || 0) + (stats?.pending_versions || 0)}
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}
