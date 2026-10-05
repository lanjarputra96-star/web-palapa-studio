// Mandiri: urutan sumber koneksi database
// 1. Binding D1 bernama "DB" di Worker Cloudflare (paling disarankan)
// 2. CLOUDFLARE_API_TOKEN (+ CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID) -> API Cloudflare
// 3. Koneksi Cloudflare bawaan Lovable (hanya di Lovable)
type D1Like = { prepare: (sql: string) => { bind: (...p: unknown[]) => { all: () => Promise<{ results: unknown[] }> } } };

async function workerEnv(): Promise<Record<string, unknown>> {
  // Server Cloudflare menyimpan env Worker (termasuk binding DB) di globalThis.__env__ pada setiap permintaan.
  const g = (globalThis as { __env__?: Record<string, unknown> }).__env__;
  if (g && typeof g === "object" && Object.keys(g).length) return g;
  try {
    const mod = (await import(/* @vite-ignore */ "cloudflare:" + "workers")) as { env?: Record<string, unknown> };
    return mod.env ?? {};
  } catch {
    return {};
  }
}

export async function d1Source(): Promise<string> {
  const wenv = await workerEnv();
  const db = wenv["DB"] as D1Like | undefined;
  if (db && typeof db.prepare === "function") return "binding-DB";
  if (wenv["CLOUDFLARE_API_TOKEN"] || process.env.CLOUDFLARE_API_TOKEN) return "api-token";
  if (process.env.LOVABLE_API_KEY && process.env.CLOUDFLARE_API_KEY) return "lovable";
  return "none";
}

export async function d1Query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const wenv = await workerEnv();
  const get = (k: string) => (typeof wenv[k] === "string" ? (wenv[k] as string) : undefined) ?? process.env[k];

  const binding = wenv["DB"] as D1Like | undefined;
  if (binding && typeof binding.prepare === "function") {
    const r = await binding.prepare(sql).bind(...params).all();
    return (r.results ?? []) as T[];
  }

  const accountId = get("CLOUDFLARE_ACCOUNT_ID") || "c29c172f6c6488512065c8efbd4fadc4";
  const databaseId = get("D1_DATABASE_ID") || "2c0a5bb3-d64c-4491-9f9f-d5c389aabbcd";
  const path = `/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const ownToken = get("CLOUDFLARE_API_TOKEN");
  let url: string;
  let headers: Record<string, string>;
  if (ownToken) {
    url = `https://api.cloudflare.com${path}`;
    headers = { Authorization: `Bearer ${ownToken}`, "Content-Type": "application/json" };
  } else {
    const lovableKey = get("LOVABLE_API_KEY");
    const cfKey = get("CLOUDFLARE_API_KEY");
    if (!lovableKey || !cfKey) throw new Error("Database belum terhubung: tambahkan binding D1 bernama DB di Worker, atau variabel CLOUDFLARE_API_TOKEN");
    const base = (get("CONNECTOR_GATEWAY_BASE_URL") ?? "https://connector-gateway.lovable.dev").replace(/\/$/, "");
    url = `${base}/cloudflare${path}`;
    headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": cfKey, "Content-Type": "application/json" };
  }
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ sql, params }) });
  if (!res.ok) throw new Error(`Cloudflare D1 gagal [${res.status}]: ${await res.text()}`);
  const json = (await res.json()) as { success: boolean; errors?: { message: string }[]; result?: { results: T[] }[] };
  if (!json.success) throw new Error(`Cloudflare D1 error: ${json.errors?.[0]?.message}`);
  return json.result?.[0]?.results ?? [];
}
