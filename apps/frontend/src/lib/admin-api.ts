import { getApiUrl } from "./env";
import { getToken } from "./auth-storage";

export async function adminFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const fetchInit: RequestInit = { ...init, headers };
  const method = fetchInit.method?.toUpperCase() || "GET";
  
  if (method === "GET") {
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
  }

  return fetch(url, fetchInit);
}
