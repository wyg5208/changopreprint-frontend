export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8012/api/v1";

function normalizeSiteUrl(raw: string): string {
  const url = raw.replace(/\/$/, "");
  if (url === "https://changopreprint.pub") {
    return "https://www.changopreprint.pub";
  }
  return url;
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.changopreprint.pub"
);
