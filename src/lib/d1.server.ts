const ACCOUNT_ID = "c29c172f6c6488512065c8efbd4fadc4";
const DATABASE_ID = "2c0a5bb3-d64c-4491-9f9f-d5c389aabbcd";

export async function d1Query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const cfKey = process.env["CLOUDFLARE_API_KEY"];
  if (!lovableKey || !cfKey) throw new Error("Missing Cloudflare connector credentials");
  const base = (process.env["CONNECTOR_GATEWAY_BASE_URL"] ?? "https://connector-gateway.lovable.dev").replace(/\/$/, "");
  const res = await fetch(`${base}/cloudflare/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": cfKey, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  if (!res.ok) throw new Error(`Cloudflare D1 failed [${res.status}]: ${await res.text()}`);
  const json = (await res.json()) as { success: boolean; errors?: { message: string }[]; result?: { results: T[] }[] };
  if (!json.success) throw new Error(`Cloudflare D1 error: ${json.errors?.[0]?.message}`);
  return json.result?.[0]?.results ?? [];
}
