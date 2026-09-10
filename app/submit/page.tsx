"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

type AuthorForm = { name: string; affiliation: string; orcid: string; is_corresponding: boolean };

const emptyAuthor = (): AuthorForm => ({
  name: "",
  affiliation: "",
  orcid: "",
  is_corresponding: false,
});

export default function SubmitPage() {
  const router = useRouter();
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
      setError(err instanceof ApiError ? err.message : "创建草稿失败");
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
      setError(err instanceof ApiError ? err.message : "上传/提交失败");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  if (step === "done") {
    return (
      <div className="cp-card">
        <h1>已提交审核</h1>
        <p>
          稿件 <code>{slug}</code> 已进入审核队列。管理员通过后会自动发布到 Zenodo 并生成 DOI，
          可在「我的稿件」页面查看进度。
        </p>
        <a className="cp-btn" href="/dashboard">
          查看我的稿件
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1>投稿 ChangoPreprint</h1>
      {step === "meta" && (
        <form className="cp-card cp-form" onSubmit={handleCreateDraft}>
          <label>中文标题</label>
          <input
            value={meta.title_zh}
            onChange={(e) => setMeta({ ...meta, title_zh: e.target.value })}
          />
          <label>英文标题</label>
          <input
            value={meta.title_en}
            onChange={(e) => setMeta({ ...meta, title_en: e.target.value })}
          />
          <p style={{ fontSize: 13, color: "#888" }}>中英文标题至少填一个</p>

          <label>中文摘要</label>
          <textarea
            rows={4}
            value={meta.abstract_zh}
            onChange={(e) => setMeta({ ...meta, abstract_zh: e.target.value })}
          />
          <label>英文摘要</label>
          <textarea
            rows={4}
            value={meta.abstract_en}
            onChange={(e) => setMeta({ ...meta, abstract_en: e.target.value })}
          />

          <label>语言</label>
          <select
            value={meta.language}
            onChange={(e) => setMeta({ ...meta, language: e.target.value })}
          >
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="bilingual">中英双语</option>
          </select>

          <label>学科领域</label>
          <input
            placeholder="例如：教育学 / Computer Science"
            value={meta.subject_area}
            onChange={(e) => setMeta({ ...meta, subject_area: e.target.value })}
          />

          <label>关键词（逗号分隔）</label>
          <input
            value={meta.keywords}
            onChange={(e) => setMeta({ ...meta, keywords: e.target.value })}
          />

          <label>许可证</label>
          <select
            value={meta.license}
            onChange={(e) => setMeta({ ...meta, license: e.target.value })}
          >
            <option value="cc-by-4.0">CC BY 4.0（默认，推荐）</option>
            <option value="cc-by-sa-4.0">CC BY-SA 4.0</option>
            <option value="cc-by-nc-4.0">CC BY-NC 4.0</option>
          </select>

          <h3 style={{ marginTop: 24 }}>作者</h3>
          {authors.map((a, idx) => (
            <div key={idx} className="cp-card" style={{ background: "#fafafa" }}>
              <label>姓名 *</label>
              <input
                required
                value={a.name}
                onChange={(e) => updateAuthor(idx, { name: e.target.value })}
              />
              <label>单位</label>
              <input
                value={a.affiliation}
                onChange={(e) => updateAuthor(idx, { affiliation: e.target.value })}
              />
              <label>ORCID</label>
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
                通讯作者
              </label>
            </div>
          ))}
          <button
            type="button"
            className="cp-btn secondary"
            onClick={() => setAuthors([...authors, emptyAuthor()])}
          >
            + 添加作者
          </button>

          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
          <div>
            <button className="cp-btn" type="submit" disabled={loading}>
              {loading ? "创建中…" : "下一步：上传 PDF"}
            </button>
          </div>
        </form>
      )}

      {step === "file" && (
        <div className="cp-card cp-form">
          <h3>上传预印本 PDF 主文件</h3>
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
            {loading ? "上传中…" : "上传并提交审核"}
          </button>
        </div>
      )}
    </div>
  );
}
