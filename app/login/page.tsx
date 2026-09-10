"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(email, password);
      saveToken(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cp-card cp-form" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>登录 ChangoPreprint</h1>
      <p style={{ fontSize: 13, color: "#888" }}>
        本站账号为学术实名体系，与 MadeChango 社区账号完全独立。
      </p>
      <form onSubmit={handleSubmit}>
        <label>邮箱</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>密码</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="cp-btn" type="submit" disabled={loading}>
          {loading ? "登录中…" : "登录"}
        </button>
      </form>
    </div>
  );
}
