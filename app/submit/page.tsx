"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type AuthorForm = { name: string; affiliation: string; orcid: string; is_corresponding: boolean };

const emptyAuthor = (): AuthorForm => ({
  name: "",
  affiliation: "",
  orcid: "",
  is_corresponding: false,
});

export default function SubmitPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<"meta" | "file" | "done">("meta");
  const [slug, setSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [meta, setMeta] = useState({
    title_zh: "",
    title_en: "",
    abstract_zh: "",
    abstract_en: "",
    language: "zh",
    subject_area: "",
    keywords: "",
    license: "cc-by-4.0",
  });
  const [authors, setAuthors] = useState<AuthorForm[]>([emptyAuthor()]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);
  }, [router]);

  function updateAuthor(idx: number, patch: Partial<AuthorForm>) {
    setAuthors((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  }

  async function handleCreateDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const res = (await api.createDraft(token, { ...meta, authors })) as { slug: string };
      setSlug(res.slug);
      setStep("file");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("submit_error_create_draft"));
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadAndSubmit() {
    if (!token || !slug || !file) return;
    setError("");
    setLoading(true);
    try {
      await api.uploadMainFile(token, slug, file);
      await api.submitForReview(token, slug);
      setStep("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("submit_error_upload"));
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  if (step === "done") {
    return (
      <div className="cp-card">
        <h1>{t("submit_done_title")}</h1>
        <p>
          {t("submit_done_body_before")}
          <code>{slug}</code>
          {t("submit_done_body_after")}
        </p>
        <a className="cp-btn" href="/dashboard">
          {t("view_my_submissions_button")}
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1>{t("submit_title")}</h1>
      {step === "meta" && (
        <form className="cp-card cp-form" onSubmit={handleCreateDraft}>
          <label>{t("submit_title_zh_label")}</label>
          <input
            value={meta.title_zh}
            onChange={(e) => setMeta({ ...meta, title_zh: e.target.value })}
          />
          <label>{t("submit_title_en_label")}</label>
          <input
            value={meta.title_en}
            onChange={(e) => setMeta({ ...meta, title_en: e.target.value })}
          />
          <p style={{ fontSize: 13, color: "#888" }}>{t("submit_title_hint")}</p>

          <label>{t("submit_abstract_zh_label")}</label>
          <textarea
            rows={4}
            value={meta.abstract_zh}
            onChange={(e) => setMeta({ ...meta, abstract_zh: e.target.value })}
          />
          <label>{t("submit_abstract_en_label")}</label>
          <textarea
            rows={4}
            value={meta.abstract_en}
            onChange={(e) => setMeta({ ...meta, abstract_en: e.target.value })}
          />

          <label>{t("submit_language_label")}</label>
          <select
            value={meta.language}
            onChange={(e) => setMeta({ ...meta, language: e.target.value })}
          >
            <option value="zh">{t("submit_language_zh")}</option>
            <option value="en">{t("submit_language_en")}</option>
            <option value="bilingual">{t("submit_language_bilingual")}</option>
          </select>

          <label>{t("submit_subject_label")}</label>
          <input
            placeholder={t("submit_subject_placeholder")}
            value={meta.subject_area}
            onChange={(e) => setMeta({ ...meta, subject_area: e.target.value })}
          />

          <label>{t("submit_keywords_label")}</label>
          <input
            value={meta.keywords}
            onChange={(e) => setMeta({ ...meta, keywords: e.target.value })}
          />

          <label>{t("submit_license_label")}</label>
          <select
            value={meta.license}
            onChange={(e) => setMeta({ ...meta, license: e.target.value })}
          >
            <option value="cc-by-4.0">{t("license_cc_by")}</option>
            <option value="cc-by-sa-4.0">{t("license_cc_by_sa")}</option>
            <option value="cc-by-nc-4.0">{t("license_cc_by_nc")}</option>
          </select>

          <h3 style={{ marginTop: 24 }}>{t("submit_authors_heading")}</h3>
          {authors.map((a, idx) => (
            <div key={idx} className="cp-card" style={{ background: "#fafafa" }}>
              <label>{t("author_name_label")}</label>
              <input
                required
                value={a.name}
                onChange={(e) => updateAuthor(idx, { name: e.target.value })}
              />
              <label>{t("author_affiliation_label")}</label>
              <input
                value={a.affiliation}
                onChange={(e) => updateAuthor(idx, { affiliation: e.target.value })}
              />
              <label>{t("author_orcid_label")}</label>
              <input
                value={a.orcid}
                onChange={(e) => updateAuthor(idx, { orcid: e.target.value })}
              />
              <label>
                <input
                  type="checkbox"
                  checked={a.is_corresponding}
                  onChange={(e) => updateAuthor(idx, { is_corresponding: e.target.checked })}
                  style={{ width: "auto", marginRight: 6 }}
                />
                {t("author_corresponding_label")}
              </label>
            </div>
          ))}
          <button
            type="button"
            className="cp-btn secondary"
            onClick={() => setAuthors([...authors, emptyAuthor()])}
          >
            {t("add_author_button")}
          </button>

          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
          <div>
            <button className="cp-btn" type="submit" disabled={loading}>
              {loading ? t("create_draft_loading") : t("create_draft_button")}
            </button>
          </div>
        </form>
      )}

      {step === "file" && (
        <div className="cp-card cp-form">
          <h3>{t("upload_pdf_heading")}</h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
          <button
            className="cp-btn"
            disabled={!file || loading}
            onClick={handleUploadAndSubmit}
          >
            {loading ? t("upload_submit_loading") : t("upload_submit_button")}
          </button>
        </div>
      )}
    </div>
  );
}
