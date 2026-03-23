import { getApiUrl } from "./env";
import type { ApiErrorBody, PaginationMeta } from "./types";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ListResponse<T> = { data: T[]; meta: PaginationMeta };

export async function fetchJson<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });
  const json = (await res.json()) as T & ApiErrorBody;
  if (!res.ok && "error" in json && json.error) {
    throw new ApiError(json.error.code, json.error.message, res.status);
  }
  if (!res.ok) {
    throw new ApiError("UNKNOWN", res.statusText || "Request failed", res.status);
  }
  return json as T;
}

export async function fetchJsonNoStore<T>(path: string, init?: RequestInit): Promise<T> {
  return fetchJson<T>(path, { ...init, cache: "no-store" });
}

export async function fetchJsonAuth<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  return fetchJson<T>(path, {
    ...init,
    cache: "no-store",
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getListData<T>(res: { data: T[]; meta?: PaginationMeta }) {
  return { items: res.data, meta: res.meta };
}
