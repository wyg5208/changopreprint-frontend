"use client";

// 管理员后台的"用户实名审核"队列，从 admin/page.tsx 拆出来的独立模块，
// 对应后端 GET /admin/users/pending + POST /admin/users/{id}/verify。
// 用户实名审核通过(approved)后 User.can_submit 才为 true，才能投稿；
// 这是当前唯一能把新用户从 pending 转为 approved 的入口。
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type PendingUser = {
  id: number;
  email: string;
  full_name: string;
  university: string;
  student_type: string;
  orcid: string;
  academic_email: string;
  verification_status: string;
  is_admin: boolean;
  can_submit: boolean;
  created_at: string | null;
};

export default function UserVerificationQueue({ token }: { token: string }) {
  const { t } = useLanguage();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function reload() {
    try {
      const res = await api.pendingUsers(token);
      setUsers(res as PendingUser[]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_user_review_error"));
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleApprove(userId: number) {
    setBusyId(userId);
    setError("");
    try {
      await api.verifyUser(token, userId, true);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_user_approve_error"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(userId: number) {
    const note = window.prompt(t("admin_reject_prompt")) || "";
    setBusyId(userId);
    setError("");
    try {
      await api.verifyUser(token, userId, false, note);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_user_action_error"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h2>{t("admin_user_review_heading")}</h2>
      <p style={{ fontSize: 13, color: "#888" }}>{t("admin_user_review_desc")}</p>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {users.length === 0 && !error && <p>{t("admin_user_review_empty")}</p>}
      {users.map((u) => (
        <div className="cp-card" key={u.id}>
          <h3>{u.full_name || t("admin_field_unnamed")}</h3>
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
          <button
            className="cp-btn"
            disabled={busyId === u.id}
            onClick={() => handleApprove(u.id)}
          >
            {busyId === u.id ? t("admin_processing") : t("admin_approve_user_button")}
          </button>{" "}
          <button
            className="cp-btn danger"
            disabled={busyId === u.id}
            onClick={() => handleReject(u.id)}
          >
            {t("admin_reject_button")}
          </button>
        </div>
      ))}
    </div>
  );
}
