"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, type UserOut } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const VERIFICATION_STATUS_KEY: Record<string, string> = {
  pending: "verification_status_pending",
  approved: "verification_status_approved",
  rejected: "verification_status_rejected",
};

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserOut | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    university: "",
    student_type: "",
    orcid: "",
    academic_email: "",
  });
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    const tk = getToken();
    if (!tk) {
      router.push("/login");
      return;
    }
    setToken(tk);
    api.me(tk).then((res) => {
      setUser(res);
      setForm({
        full_name: res.full_name || "",
        university: res.university || "",
        student_type: res.student_type || "",
        orcid: res.orcid || "",
        academic_email: res.academic_email || "",
      });
    });
  }, [router]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaveMsg("");
    setSaveError("");
    setSaving(true);
    try {
      const updated = await api.updateProfile(token, form);
      setUser(updated);
      setSaveMsg(
        updated.verification_status === "pending" && user?.verification_status === "approved"
          ? t("profile_identity_changed_notice")
          : t("profile_save_success")
      );
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : t("profile_save_error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPwMsg("");
    setPwError("");
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError(t("profile_password_mismatch"));
      return;
    }
    setPwSaving(true);
    try {
      await api.changePassword(token, pwForm.old_password, pwForm.new_password);
      setPwMsg(t("profile_change_password_success"));
      setPwForm({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setPwError(err instanceof ApiError ? err.message : t("profile_change_password_error"));
    } finally {
      setPwSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>{t("profile_title")}</h1>

      <form className="cp-card cp-form" onSubmit={handleSave}>
        <label>{t("profile_email_label")}</label>
        <input value={user.email} disabled />

        <p style={{ fontSize: 13, color: "#888" }}>
          {t("profile_verification_status_label")}
          {t(VERIFICATION_STATUS_KEY[user.verification_status] || user.verification_status)} ·{" "}
          {user.can_submit ? t("profile_can_submit_yes") : t("profile_can_submit_no")}
        </p>

        <label>{t("register_fullname_label")}</label>
        <input
          required
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
        />
        <label>{t("register_university_label")}</label>
        <input
          required
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

        {saveMsg && <p className="cp-hint">{saveMsg}</p>}
        {saveError && <p style={{ color: "#b91c1c" }}>{saveError}</p>}
        <button className="cp-btn" type="submit" disabled={saving}>
          {saving ? t("profile_save_loading") : t("profile_save_button")}
        </button>
      </form>

      <form className="cp-card cp-form" onSubmit={handleChangePassword}>
        <h3 style={{ marginTop: 0 }}>{t("profile_change_password_heading")}</h3>
        <label>{t("profile_old_password_label")}</label>
        <input
          type="password"
          required
          value={pwForm.old_password}
          onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })}
        />
        <label>{t("profile_new_password_label")}</label>
        <input
          type="password"
          required
          minLength={8}
          value={pwForm.new_password}
          onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
        />
        <label>{t("profile_confirm_password_label")}</label>
        <input
          type="password"
          required
          minLength={8}
          value={pwForm.confirm}
          onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
        />
        {pwMsg && <p className="cp-hint">{pwMsg}</p>}
        {pwError && <p style={{ color: "#b91c1c" }}>{pwError}</p>}
        <button className="cp-btn" type="submit" disabled={pwSaving}>
          {pwSaving ? t("profile_change_password_loading") : t("profile_change_password_button")}
        </button>
      </form>
    </div>
  );
}
