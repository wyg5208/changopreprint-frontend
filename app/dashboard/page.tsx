"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type PreprintSummary } from "@/lib/api";
import { getToken } from "@/lib/auth";
import PublishedActions from "@/components/PublishedActions";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [items, setItems] = useState<PreprintSummary[]>([]);
  const [error, setError] = useState("");

  const STATUS_LABEL: Record<string, string> = {
    draft: t("status_draft"),
    submitted: t("status_submitted"),
    under_review: t("status_under_review"),
    published: t("status_published"),
    rejected: t("status_rejected"),
    withdrawn: t("status_withdrawn"),
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .listMine(token)
      .then((res) => setItems(res as PreprintSummary[]))
      .catch(() => setError(t("dashboard_error")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div>
      <h1>{t("dashboard_title")}</h1>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {items.length === 0 && (
        <p>
          {t("dashboard_empty_before")}
          <a href="/submit">{t("dashboard_empty_link")}</a>
          {t("dashboard_empty_after")}
        </p>
      )}
      {items.map((item) => (
        <div className="cp-card" key={item.slug}>
          <span className="cp-badge">{STATUS_LABEL[item.status] || item.status}</span>
          <h3>{item.title_zh || item.title_en}</h3>
          {item.version_doi && (
            <p>
              DOI: <span className="cp-doi">{item.version_doi}</span>
            </p>
          )}
          {(item.status === "published" || item.status === "withdrawn") && (
            <a href={`/p/${item.slug}`}>{t("dashboard_view_landing")}</a>
          )}
          <PublishedActions
            item={item}
            onUpdated={(updated) =>
              setItems((prev) => prev.map((it) => (it.slug === updated.slug ? updated : it)))
            }
          />
        </div>
      ))}
    </div>
  );
}
