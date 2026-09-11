// ChangoPreprint 前端 API 封装。
//
// 只对接独立 FastAPI 后端（NEXT_PUBLIC_API_BASE），不调用 madechango.com
// 任何接口 —— 两个用户体系刻意不打通，本站不做主站登录态识别。

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8012/api/v1";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }
  if (rest.body && !(rest.body instanceof FormData) && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const resp = await fetch(`${API_BASE}${path}`, { ...rest, headers: finalHeaders });
  if (!resp.ok) {
    let detail = resp.statusText;
    try {
      const data = await resp.json();
      detail = data.detail || detail;
    } catch {
      // ignore
    }
    throw new ApiError(resp.status, detail);
  }
  if (resp.status === 204) {
    return undefined as unknown as T;
  }
  return resp.json() as Promise<T>;
}

export const api = {
  register: (payload: Record<string, unknown>) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: (token: string) => request<UserOut>("/auth/me", { token }),
  updateProfile: (token: string, payload: Record<string, unknown>) =>
    request<UserOut>("/auth/me", { method: "PUT", token, body: JSON.stringify(payload) }),
  changePassword: (token: string, oldPassword: string, newPassword: string) =>
    request("/auth/change-password", {
      method: "POST",
      token,
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),

  createDraft: (token: string, payload: Record<string, unknown>) =>
    request("/preprints/", { method: "POST", token, body: JSON.stringify(payload) }),
  updateDraft: (token: string, slug: string, payload: Record<string, unknown>) =>
    request(`/preprints/${slug}`, { method: "PUT", token, body: JSON.stringify(payload) }),
  uploadMainFile: (token: string, slug: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request(`/preprints/${slug}/file`, { method: "POST", token, body: form });
  },
  submitForReview: (token: string, slug: string) =>
    request(`/preprints/${slug}/submit`, { method: "POST", token }),
  listMine: (token: string) => request<PreprintSummary[]>("/preprints/mine", { token }),

  // 发布后仍可执行的动作：撤稿 / 关联期刊DOI / 提交新版本
  withdraw: (token: string, slug: string, note: string) =>
    request(`/preprints/${slug}/withdraw`, {
      method: "POST",
      token,
      body: JSON.stringify({ note }),
    }),
  addRelatedIdentifier: (
    token: string,
    slug: string,
    payload: { identifier: string; relation?: string; identifier_type?: string }
  ) =>
    request(`/preprints/${slug}/related-identifiers`, {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  uploadNewVersion: (token: string, slug: string, file: File, changelog = "") => {
    const form = new FormData();
    form.append("file", file);
    const qs = changelog ? `?changelog=${encodeURIComponent(changelog)}` : "";
    return request(`/preprints/${slug}/versions${qs}`, { method: "POST", token, body: form });
  },

  browse: (params: { q?: string; subject_area?: string; author?: string; page?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.subject_area) search.set("subject_area", params.subject_area);
    if (params.author) search.set("author", params.author);
    if (params.page) search.set("page", String(params.page));
    const qs = search.toString();
    return request<{ total: number; page: number; page_size: number; items: PreprintSummary[] }>(
      `/public/preprints${qs ? `?${qs}` : ""}`
    );
  },
  getLanding: (slug: string) =>
    request<LandingData>(`/public/preprints/${slug}`, { cache: "no-store" } as RequestInit),

  // 管理端
  reviewQueue: (token: string) => request<PreprintSummary[]>("/admin/preprints/queue", { token }),
  approve: (token: string, slug: string) =>
    request(`/admin/preprints/${slug}/approve`, { method: "POST", token }),
  reject: (token: string, slug: string, reason: string) =>
    request(`/admin/preprints/${slug}/reject`, {
      method: "POST",
      token,
      body: JSON.stringify({ reason }),
    }),
  pendingUsers: (token: string) => request("/admin/users/pending", { token }),
  verifyUser: (token: string, userId: number, approve: boolean, note = "") =>
    request(`/admin/users/${userId}/verify`, {
      method: "POST",
      token,
      body: JSON.stringify({ approve, note }),
    }),
  pendingVersions: (token: string) =>
    request<(PreprintSummary & { pending_version: PreprintVersionInfo })[]>(
      "/admin/preprints/pending-versions",
      { token }
    ),
  publishVersion: (token: string, slug: string) =>
    request(`/admin/preprints/${slug}/publish-version`, { method: "POST", token }),
};

export type UserOut = {
  id: number;
  email: string;
  full_name: string;
  university: string;
  student_type: string;
  orcid: string;
  academic_email: string;
  verification_status: string;
  is_admin: boolean;
  can_submit: boolean;
};

export type PreprintAuthor = {
  name: string;
  affiliation: string;
  orcid: string;
  is_corresponding: boolean;
};

export type PreprintVersionInfo = {
  version_no: number;
  changelog: string;
  doi: string;
  original_filename: string;
  file_size_bytes: number;
  created_at: string | null;
};

export type RelatedIdentifierInfo = {
  relation: string;
  identifier: string;
  identifier_type: string;
};

export type PreprintSummary = {
  id: number;
  slug: string;
  title_zh: string;
  title_en: string;
  abstract_zh: string;
  abstract_en: string;
  language: string;
  subject_area: string;
  keywords: string[];
  license: string;
  status: string;
  concept_doi: string;
  version_doi: string;
  journal_doi: string;
  withdrawal_note: string;
  authors: PreprintAuthor[];
  latest_version: { version_no: number; original_filename: string } | null;
  versions: PreprintVersionInfo[];
  related_identifiers: RelatedIdentifierInfo[];
  view_count: number;
  download_count: number;
  published_at: string | null;
  created_at: string;
};

export type LandingData = {
  preprint: PreprintSummary;
  pdf_url: string;
  scholar_meta: { name: string; content: string }[];
  json_ld: Record<string, unknown>;
  canonical_url: string;
};
