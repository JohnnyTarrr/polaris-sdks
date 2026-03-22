/**
 * Shared helper for tools that call the Polaris API directly
 * (used when the polaris-news-api SDK client doesn't yet expose the method).
 */

const DEFAULT_BASE_URL = "https://api.thepolarisreport.com";

declare const fetch: (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

declare class URLSearchParams {
  constructor(init?: Record<string, string>);
  set(name: string, value: string): void;
  toString(): string;
}

export interface ToolOptions {
  apiKey?: string;
  baseUrl?: string;
}

export async function polarisGet(
  options: ToolOptions,
  path: string,
  params?: Record<string, string | undefined>,
): Promise<Record<string, unknown>> {
  const base = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const qs = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) qs.set(k, v);
    }
  }
  const qsStr = qs.toString();
  const url = `${base}${path}${qsStr ? `?${qsStr}` : ""}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.apiKey) headers["Authorization"] = `Bearer ${options.apiKey}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Polaris API error ${res.status}`);
  return res.json() as Promise<Record<string, unknown>>;
}
