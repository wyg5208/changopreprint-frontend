"use client";

// 首页统计条：只放真实数字（本站原创发布数/浏览下载量/学术资讯来源数），
// 混入两条不依赖具体数字的信任类标签（DOI永久归档、免费），这是平台早期
// 规模较小时常见的做法——不编造夸大的假数据，但也不会显得空洞。
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { PlatformStats } from "@/lib/api";

export default function StatsStrip({ stats }: { stats: PlatformStats }) {
  const { t } = useLanguage();

  return (
    <div className="cp-stats-strip">
      <div className="cp-stat-item">
        <div className="cp-stat-value">{stats.published_count}</div>
        <div className="cp-stat-label">{t("stats_published_label")}</div>
      </div>
      <div className="cp-stat-item">
        <div className="cp-stat-value">{stats.showcase_count}+</div>
        <div className="cp-stat-label">
          {t("stats_showcase_label", { n: stats.showcase_source_count })}
        </div>
      </div>
      <div className="cp-stat-item">
        <div className="cp-stat-value">{t("stats_doi_value")}</div>
        <div className="cp-stat-label">{t("stats_doi_label")}</div>
      </div>
      <div className="cp-stat-item">
        <div className="cp-stat-value">{t("stats_free_value")}</div>
        <div className="cp-stat-label">{t("stats_free_label")}</div>
      </div>
    </div>
  );
}
