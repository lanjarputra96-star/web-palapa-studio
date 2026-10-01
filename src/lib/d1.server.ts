// Mandiri: jika CLOUDFLARE_API_TOKEN diisi, langsung ke API Cloudflare.
// Jika tidak, memakai koneksi Cloudflare bawaan Lovable.
export async function d1Query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"] || "c29c172f6c6488512065c8efbd4fadc4";
  const databaseId = process.env["D1_DATABASE_ID"] || "2c0a5bb3-d64c-4491-9f9f-d5c389aabbcd";
  const path = `/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const ownToken = process.env["CLOUDFLARE_API_TOKEN"];
  let url: string;
  let headers: Record<string, string>;
  if (ownToken) {
    url = `https://api.cloudflare.com${path}`;
    headers = { Authorization: `Bearer ${ownToken}`, "Content-Type": "application/json" };
  } else {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const cfKey = process.env["CLOUDFLARE_API_KEY"];
    if (!lovableKey || !cfKey) throw new Error("CLOUDFLARE_API_TOKEN belum diatur");
    const base = (process.env["CONNECTOR_GATEWAY_BASE_URL"] ?? "https://connector-gateway.lovable.dev").replace(/\/$/, "");
    url = `${base}/cloudflare${path}`;
    headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": cfKey, "Content-Type": "application/json" };
  }
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ sql, params }) });
  if (!res.ok) throw new Error(`Cloudflare D1 failed [${res.status}]: ${await res.text()}`);
  const json = (await res.json()) as { success: boolean; errors?: { message: string }[]; result?: { results: T[] }[] };
  if (!json.success) throw new Error(`Cloudflare D1 error: ${json.errors?.[0]?.message}`);
  return json.result?.[0]?.results ?? [];
}
