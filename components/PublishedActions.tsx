"use client";

// 已发布稿件的三个学术完整度动作：撤稿 / 关联期刊DOI / 提交新版本。
// 单独拆成组件，避免 dashboard/page.tsx 随着功能增加变得臃肿。
import { useState } from "react";
import { api, type PreprintSummary } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function PublishedActions({
  item,
  onUpdated,
}: {
  item: PreprintSummary;
  onUpdated: (updated: PreprintSummary) => void;
}) {
  const [open, setOpen] = useState<"" | "withdraw" | "doi" | "version">("");
  const [note, setNote] = useState("");
  const [doi, setDoi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const token = getToken();
  if (!token || (item.status !== "published" && item.status !== "withdrawn")) return null;

  const pendingVersion = item.versions.find((v) => !v.doi);

  async function doWithdraw() {
    setBusy(true);
    setMsg("");
    try {
      const updated = await api.withdraw(token!, item.slug, note);
      onUpdated(updated as PreprintSummary);
      setOpen("");
    } catch (e) {
      setMsg((e as Error).message || "撤稿失败");
    } finally {
      setBusy(false);
    }
  }

  async function doAddDoi() {
    setBusy(true);
    setMsg("");
    try {
      const updated = await api.addRelatedIdentifier(token!, item.slug, { identifier: doi });
      onUpdated(updated as PreprintSummary);
      setOpen("");
      setDoi("");
    } catch (e) {
      setMsg((e as Error).message || "关联失败");
    } finally {
      setBusy(false);
    }
  }

  async function doUploadVersion() {
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const updated = await api.uploadNewVersion(token!, item.slug, file, changelog);
      onUpdated(updated as PreprintSummary);
      setOpen("");
      setFile(null);
      setChangelog("");
      setMsg("新版本已上传，等待管理员审核发布到 Zenodo");
    } catch (e) {
      setMsg((e as Error).message || "上传失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cp-published-actions">
      {item.status === "published" && (
        <div className="cp-action-buttons">
          <button className="cp-btn-link" onClick={() => setOpen(open === "withdraw" ? "" : "withdraw")}>
            撤稿
          </button>
          <button className="cp-btn-link" onClick={() => setOpen(open === "doi" ? "" : "doi")}>
            关联期刊DOI
          </button>
          <button className="cp-btn-link" onClick={() => setOpen(open === "version" ? "" : "version")}>
            上传新版本
          </button>
        </div>
      )}

      {item.journal_doi && <p className="cp-hint">已关联期刊 DOI: {item.journal_doi}</p>}
      {pendingVersion && (
        <p className="cp-hint">
          第 {pendingVersion.version_no} 版已上传，等待管理员审核发布到 Zenodo
        </p>
      )}
      {item.status === "withdrawn" && item.withdrawal_note && (
        <p className="cp-hint">撤稿说明：{item.withdrawal_note}</p>
      )}

      {open === "withdraw" && (
        <div className="cp-inline-form">
          <textarea
            placeholder="撤稿说明（必填，会公开展示在落地页）"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button disabled={busy || !note} onClick={doWithdraw}>
            确认撤稿
          </button>
        </div>
      )}

      {open === "doi" && (
        <div className="cp-inline-form">
          <input
            placeholder="正式期刊 DOI，例如 10.1000/xyz123"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
          />
          <button disabled={busy || !doi} onClick={doAddDoi}>
            提交
          </button>
        </div>
      )}

      {open === "version" && (
        <div className="cp-inline-form">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input
            placeholder="修订说明（选填）"
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
          />
          <button disabled={busy || !file} onClick={doUploadVersion}>
            上传
          </button>
        </div>
      )}

      {msg && <p className="cp-hint">{msg}</p>}
    </div>
  );
}
