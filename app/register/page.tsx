"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    university: "",
    student_type: "",
    orcid: "",
    academic_email: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="cp-card">
        <h1>注册成功</h1>
        <p>
          您的实名资料已提交，需等待管理员审核通过（
          <strong>verification_status: pending</strong>）后才能投稿。
          即将跳转到登录页…
        </p>
      </div>
    );
  }

  return (
    <div className="cp-card cp-form" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>注册 ChangoPreprint 账号</h1>
      <p style={{ fontSize: 13, color: "#888" }}>
        投稿需要学术实名审核：请填写法定姓名与所属高校，建议补充 ORCID。
      </p>
      <form onSubmit={handleSubmit}>
        <label>邮箱 *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <label>密码 *（至少 8 位）</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />
        <label>法定姓名 *</label>
        <input
          required
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
        />
        <label>所属高校 *</label>
        <input
          required
          placeholder="例如：马来亚大学"
          value={form.university}
          onChange={(e) => update("university", e.target.value)}
        />
        <label>身份</label>
        <select value={form.student_type} onChange={(e) => update("student_type", e.target.value)}>
          <option value="">请选择</option>
          <option value="本科生">本科生</option>
          <option value="硕士生">硕士生</option>
          <option value="博士生">博士生</option>
          <option value="教职工">教职工</option>
          <option value="其它">其它</option>
        </select>
        <label>ORCID（建议填写）</label>
        <input
          placeholder="0000-0000-0000-0000"
          value={form.orcid}
          onChange={(e) => update("orcid", e.target.value)}
        />
        <label>学校邮箱（便于人工核验身份）</label>
        <input
          type="email"
          value={form.academic_email}
          onChange={(e) => update("academic_email", e.target.value)}
        />
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="cp-btn" type="submit" disabled={loading}>
          {loading ? "提交中…" : "提交注册"}
        </button>
      </form>
    </div>
  );
}
