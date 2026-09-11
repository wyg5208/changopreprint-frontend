"use client";

// 登录态下右上角的头像+下拉菜单（我的稿件/编辑资料/退出）；
// 未登录时退化为原来的"登录/注册"两个链接。
// 头像不做图片上传，用姓名/邮箱首字母生成一个纯色圆形头像 —— 避免为了
// 一个头像功能再引入 OSS 图片上传+裁剪的一整套基础设施。
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type UserOut } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function UserMenu() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<UserOut | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setReady(true);
      return;
    }
    api
      .me(token)
      .then((res) => setUser(res))
      .catch(() => {
        // token 失效（过期/被停用），静默清掉，退化为未登录展示
        clearToken();
        setUser(null);
      })
      .finally(() => setReady(true));
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

  function handleLogout() {
    clearToken();
    setUser(null);
    setOpen(false);
    router.push("/");
  }

  // 首次渲染（SSR + hydrate 前一瞬）不知道登录态，先不渲染任何东西，
  // 避免闪一下"登录/注册"再跳成头像的抖动。
  if (!ready) return <span style={{ display: "inline-block", width: 1 }} />;

  if (!user) {
    return (
      <>
        <Link href="/login">{t("nav_login")}</Link>
        <Link href="/register">{t("nav_register")}</Link>
      </>
    );
  }

  const displayName = user.full_name || user.email;
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="cp-user-menu" ref={rootRef}>
      <button
        type="button"
        className="cp-avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={displayName}
      >
        <span className="cp-avatar">{initial}</span>
      </button>
      {open && (
        <div className="cp-user-dropdown">
          <div className="cp-user-dropdown-header">
            <strong>{displayName}</strong>
            <span className="cp-user-dropdown-email">{user.email}</span>
          </div>
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            {t("nav_dashboard")}
          </Link>
          <Link href="/profile" onClick={() => setOpen(false)}>
            {t("nav_profile")}
          </Link>
          <button type="button" className="cp-user-dropdown-logout" onClick={handleLogout}>
            {t("nav_logout")}
          </button>
        </div>
      )}
    </div>
  );
}
