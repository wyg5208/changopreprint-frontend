"use client";

// 给 Server Component（如落地页 /p/[slug]、作者页）用的小翻译占位组件：
// SSR 阶段固定输出中文（因为拿不到 localStorage），Hydrate 后按用户
// 选择的语言重新渲染。这样可以在不把整页转成 Client Component 的前提下，
// 局部翻译静态文案。
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function T({
  k,
  vars,
}: {
  k: string;
  vars?: Record<string, string | number>;
}) {
  const { t } = useLanguage();
  return <>{t(k, vars)}</>;
}
