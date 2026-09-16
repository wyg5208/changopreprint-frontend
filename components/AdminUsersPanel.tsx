"use client";

// 管理后台「用户」页：待审核优先展示，下面是全部用户列表，
// 可按状态筛选、通过/拒绝实名、停用/恢复账号。
import { useEffect, useState } from "react";
import { api, ApiError, type AdminUser } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type Filter = "pending" | "all" | "approved" | "rejected";

export default function AdminUsersPanel({ token }: { token: string }) {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function reload(next: Filter = filter) {
    try {
      const status = next === "all" ? "" : next;
      const res = await api.listUsers(token, status);
      setUsers(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_user_review_error"));
    }
  }

  useEffect(() => {
    reload(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filter]);

  async function handleVerify(userId: number, approve: boolean) {
    let note = "";
    if (!approve) {
      const typed = window.prompt(t("admin_reject_prompt"));
      if (typed === null) return;
      note = typed;
    }
    setBusyId(userId);
    setError("");
    try {
      await api.verifyUser(token, userId, approve, note);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_user_action_error"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleActive(userId: number, isActive: boolean) {
    setBusyId(userId);
    setError("");
    try {
      await api.setUserActive(token, userId, isActive);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_user_action_error"));
    } finally {
      setBusyId(null);
    }
  }

  const filters: { id: Filter; labelKey: string }[] = [
    { id: "pending", labelKey: "admin_filter_pending" },
    { id: "all", labelKey: "admin_filter_all" },
    { id: "approved", labelKey: "admin_filter_approved" },
    { id: "rejected", labelKey: "admin_filter_rejected" },
  ];

  return (
    <div>
      <h1>{t("admin_users_title")}</h1>
      <p style={{ fontSize: 13, color: "#888" }}>{t("admin_users_desc")}</p>
      <div className="cp-admin-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`cp-admin-filter${filter === f.id ? " active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {users.length === 0 && !error && <p>{t("admin_users_empty")}</p>}
      {users.map((u) => (
        <div className="cp-card" key={u.id}>
          <div className="cp-admin-user-head">
            <h3 style={{ margin: 0 }}>{u.full_name || t("admin_field_unnamed")}</h3>
            <span className={`cp-badge${u.verification_status === "pending" ? "" : " secondary"}`}>
              {t(`verification_status_${u.verification_status}`) || u.verification_status}
            </span>
            {!u.is_active && <span className="cp-badge danger">{t("admin_user_disabled")}</span>}
            {u.is_admin && <span className="cp-badge">{t("admin_user_is_admin")}</span>}
          </div>
          <p style={{ fontSize: 13, color: "#555" }}>
            {t("admin_field_email")}
            {u.email} · {t("admin_field_university")}
            {u.university || "-"} · {t("admin_field_identity")}
            {u.student_type || "-"}
          </p>
          <p style={{ fontSize: 13, color: "#555" }}>
            {t("admin_field_orcid")}
            {u.orcid || "-"} · {t("admin_field_academic_email")}
            {u.academic_email || "-"}
          </p>
          <p style={{ fontSize: 12, color: "#999" }}>
            {t("admin_field_registered_at")}
            {u.created_at || "-"}
          </p>
          <div className="cp-admin-actions">
            {u.verification_status !== "approved" && (
              <button
                className="cp-btn"
                disabled={busyId === u.id}
                onClick={() => handleVerify(u.id, true)}
              >
                {busyId === u.id ? t("admin_processing") : t("admin_approve_user_button")}
              </button>
            )}
            {u.verification_status !== "rejected" && (
              <button
                className="cp-btn danger"
                disabled={busyId === u.id}
                onClick={() => handleVerify(u.id, false)}
              >
                {t("admin_reject_button")}
              </button>
            )}
            {!u.is_admin && u.is_active && (
              <button
                className="cp-btn secondary"
                disabled={busyId === u.id}
                onClick={() => handleActive(u.id, false)}
              >
                {t("admin_disable_user")}
              </button>
            )}
            {!u.is_admin && !u.is_active && (
              <button
                className="cp-btn"
                disabled={busyId === u.id}
                onClick={() => handleActive(u.id, true)}
              >
                {t("admin_enable_user")}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
