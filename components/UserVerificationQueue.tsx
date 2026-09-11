"use client";

// 管理员后台的"用户实名审核"队列，从 admin/page.tsx 拆出来的独立模块，
// 对应后端 GET /admin/users/pending + POST /admin/users/{id}/verify。
// 用户实名审核通过(approved)后 User.can_submit 才为 true，才能投稿；
// 这是当前唯一能把新用户从 pending 转为 approved 的入口。
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

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
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function reload() {
    try {
      const res = await api.pendingUsers(token);
      setUsers(res as PendingUser[]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "加载用户实名审核队列失败");
    }
  }

  useEffect(() => {
    reload();
  }, [token]);

  async function handleApprove(userId: number) {
    setBusyId(userId);
    setError("");
    try {
      await api.verifyUser(token, userId, true);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "审核通过失败");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(userId: number) {
    const note = window.prompt("请填写拒绝理由（可选）") || "";
    setBusyId(userId);
    setError("");
    try {
      await api.verifyUser(token, userId, false, note);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "操作失败");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h2>用户实名审核</h2>
      <p style={{ fontSize: 13, color: "#888" }}>
        通过后该用户才能投稿（can_submit），拒绝不会删除账号，可随时重新审核。
      </p>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {users.length === 0 && !error && <p>暂无待审核用户。</p>}
      {users.map((u) => (
        <div className="cp-card" key={u.id}>
          <h3>{u.full_name || "（未填写姓名）"}</h3>
          <p style={{ fontSize: 13, color: "#555" }}>
            邮箱：{u.email} · 学校：{u.university || "-"} · 身份：{u.student_type || "-"}
          </p>
          <p style={{ fontSize: 13, color: "#555" }}>
            ORCID：{u.orcid || "-"} · 学术邮箱：{u.academic_email || "-"}
          </p>
          <p style={{ fontSize: 12, color: "#999" }}>注册时间：{u.created_at || "-"}</p>
          <button
            className="cp-btn"
            disabled={busyId === u.id}
            onClick={() => handleApprove(u.id)}
          >
            {busyId === u.id ? "处理中…" : "通过实名审核"}
          </button>{" "}
          <button
            className="cp-btn danger"
            disabled={busyId === u.id}
            onClick={() => handleReject(u.id)}
          >
            拒绝
          </button>
        </div>
      ))}
    </div>
  );
}
