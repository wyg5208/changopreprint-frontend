// 极简客户端 token 存储。ChangoPreprint 账号体系与 MadeChango 主站完全
//独立，token 只存本站 localStorage，不写任何跨域 cookie。

const TOKEN_KEY = "changopreprint_token";

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}
