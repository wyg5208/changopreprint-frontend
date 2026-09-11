"use client";

// 已发布稿件的三个学术完整度动作：撤稿 / 关联期刊DOI / 提交新版本。
// 单独拆成组件，避免 dashboard/page.tsx 随着功能增加变得臃肿。
import { useState } from "react";
import { api, type PreprintSummary } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function PublishedActions({
  item,
  onUpdated,
}: {
  item: PreprintSummary;
  onUpdated: (updated: PreprintSummary) => void;
}) {
  const { t } = useLanguage();
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
      setMsg((e as Error).message || t("published_withdraw_failed"));
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
      setMsg((e as Error).message || t("published_link_failed"));
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
      setMsg(t("published_version_uploaded_success"));
    } catch (e) {
      setMsg((e as Error).message || t("published_upload_failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cp-published-actions">
      {item.status === "published" && (
        <div className="cp-action-buttons">
          <button className="cp-btn-link" onClick={() => setOpen(open === "withdraw" ? "" : "withdraw")}>
            {t("published_withdraw_button")}
          </button>
          <button className="cp-btn-link" onClick={() => setOpen(open === "doi" ? "" : "doi")}>
            {t("published_link_doi_button")}
          </button>
          <button className="cp-btn-link" onClick={() => setOpen(open === "version" ? "" : "version")}>
            {t("published_upload_version_button")}
          </button>
        </div>
      )}

      {item.journal_doi && (
        <p className="cp-hint">{t("published_journal_doi_linked", { doi: item.journal_doi })}</p>
      )}
      {pendingVersion && (
        <p className="cp-hint">
          {t("published_pending_version_hint", { n: pendingVersion.version_no })}
        </p>
      )}
      {item.status === "withdrawn" && item.withdrawal_note && (
        <p className="cp-hint">
          {t("published_withdrawal_note_label")}
          {item.withdrawal_note}
        </p>
      )}

      {open === "withdraw" && (
        <div className="cp-inline-form">
          <textarea
            placeholder={t("published_withdraw_placeholder")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button disabled={busy || !note} onClick={doWithdraw}>
            {t("published_withdraw_confirm")}
          </button>
        </div>
      )}

      {open === "doi" && (
        <div className="cp-inline-form">
          <input
            placeholder={t("published_doi_placeholder")}
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
          />
          <button disabled={busy || !doi} onClick={doAddDoi}>
            {t("published_submit")}
          </button>
        </div>
      )}

      {open === "version" && (
        <div className="cp-inline-form">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input
            placeholder={t("published_changelog_placeholder")}
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
          />
          <button disabled={busy || !file} onClick={doUploadVersion}>
            {t("published_upload")}
          </button>
        </div>
      )}

      {msg && <p className="cp-hint">{msg}</p>}
    </div>
  );
}
