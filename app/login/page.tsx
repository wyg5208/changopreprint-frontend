"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
      setError(err instanceof ApiError ? err.message : t("login_error_default"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cp-card cp-form" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>{t("login_title")}</h1>
      <p style={{ fontSize: 13, color: "#888" }}>{t("login_desc")}</p>
      <form onSubmit={handleSubmit}>
        <label>{t("login_email_label")}</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>{t("login_password_label")}</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="cp-btn" type="submit" disabled={loading}>
          {loading ? t("login_submit_loading") : t("login_submit")}
        </button>
      </form>
    </div>
  );
}
