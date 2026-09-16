"use client";

// 学科领域标签，供 Server Component（落地页 /p/[slug] 等）用：
// SSR 阶段固定按中文渲染（拿不到 localStorage），Hydrate 后按用户选择
// 的语言重新渲染——与 components/T.tsx 是同一个模式。
//
// value 存的是受控词表 value（如 "computer_science"），不是展示文案，
// 这里负责映射成当前语言的标签。
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { subjectAreaLabel } from "@/lib/subjectAreas";

export default function SubjectBadge({
  primary,
  secondary,
}: {
  primary: string;
  secondary?: string;
}) {
  const { locale } = useLanguage();
  return (
    <>
      {primary && <span className="cp-badge">{subjectAreaLabel(primary, locale)}</span>}
      {secondary && (
        <span className="cp-badge secondary">{subjectAreaLabel(secondary, locale)}</span>
      )}
    </>
  );
}
