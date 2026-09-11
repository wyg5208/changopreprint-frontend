"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
      setError(err instanceof ApiError ? err.message : t("register_error_default"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="cp-card">
        <h1>{t("register_success_title")}</h1>
        <p>{t("register_success_body")}</p>
      </div>
    );
  }

  return (
    <div className="cp-card cp-form" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>{t("register_title")}</h1>
      <p style={{ fontSize: 13, color: "#888" }}>{t("register_desc")}</p>
      <form onSubmit={handleSubmit}>
        <label>{t("register_email_label")}</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <label>{t("register_password_label")}</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />
        <label>{t("register_fullname_label")}</label>
        <input
          required
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
        />
        <label>{t("register_university_label")}</label>
        <input
          required
          placeholder={t("register_university_placeholder")}
          value={form.university}
          onChange={(e) => update("university", e.target.value)}
        />
        <label>{t("register_student_type_label")}</label>
        <select value={form.student_type} onChange={(e) => update("student_type", e.target.value)}>
          <option value="">{t("register_student_type_placeholder")}</option>
          <option value="本科生">{t("register_student_type_undergrad")}</option>
          <option value="硕士生">{t("register_student_type_master")}</option>
          <option value="博士生">{t("register_student_type_phd")}</option>
          <option value="教职工">{t("register_student_type_faculty")}</option>
          <option value="其它">{t("register_student_type_other")}</option>
        </select>
        <label>{t("register_orcid_label")}</label>
        <input
          placeholder="0000-0000-0000-0000"
          value={form.orcid}
          onChange={(e) => update("orcid", e.target.value)}
        />
        <label>{t("register_academic_email_label")}</label>
        <input
          type="email"
          value={form.academic_email}
          onChange={(e) => update("academic_email", e.target.value)}
        />
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="cp-btn" type="submit" disabled={loading}>
          {loading ? t("register_submit_loading") : t("register_submit")}
        </button>
      </form>
    </div>
  );
}
