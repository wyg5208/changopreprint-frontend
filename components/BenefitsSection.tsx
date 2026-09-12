"use client";

// 首页"为什么投稿 ChangoPreprint"板块，文案沿用之前站内群发邮件里
// 验证过的卖点（永久DOI / 原创优先权 / 便于引用 / 免费低门槛）。
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const ITEMS: { icon: string; titleKey: string; descKey: string }[] = [
  { icon: "🚀", titleKey: "benefit_doi_title", descKey: "benefit_doi_desc" },
  { icon: "🏆", titleKey: "benefit_priority_title", descKey: "benefit_priority_desc" },
  { icon: "🔗", titleKey: "benefit_cite_title", descKey: "benefit_cite_desc" },
  { icon: "🎓", titleKey: "benefit_free_title", descKey: "benefit_free_desc" },
];

export default function BenefitsSection() {
  const { t } = useLanguage();

  return (
    <section className="cp-section cp-benefits-section">
      <h2 className="cp-section-title">{t("benefits_heading")}</h2>
      <div className="cp-benefits-grid">
        {ITEMS.map((item) => (
          <div key={item.titleKey} className="cp-benefit-item">
            <div className="cp-benefit-icon">{item.icon}</div>
            <h3 className="cp-benefit-title">{t(item.titleKey)}</h3>
            <p className="cp-benefit-desc">{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
