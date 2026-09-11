import type { Metadata } from "next";

export const noindexMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false, nocache: true },
});

export function scholarMetaToOther(tags: { name: string; content: string }[]): Record<string, string | string[]> {
  const buckets = new Map<string, string[]>();
  for (const tag of tags) {
    const list = buckets.get(tag.name) ?? [];
    list.push(tag.content);
    buckets.set(tag.name, list);
  }
  const other: Record<string, string | string[]> = {};
  for (const [name, values] of buckets) {
    other[name] = values.length === 1 ? values[0] : values;
  }
  return other;
}

export function metaDescription(text: string, max = 220): string {
  const compact = (text || "").replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  const sliced = compact.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}
