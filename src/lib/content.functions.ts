import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { defaultContent, mergeContent } from "./content";
import { d1Query } from "./d1.server";

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const rows = await d1Query<{ data: string }>("SELECT data FROM site_content WHERE id = 'main'");
    return rows[0] ? mergeContent(JSON.parse(rows[0].data)) : defaultContent;
  } catch (e) {
    console.error(e);
    return defaultContent;
  }
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid content");
    return data as Record<string, unknown>;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const content = mergeContent(data);
    await d1Query("CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT)");
    await d1Query(
      "INSERT INTO site_content (id, data, updated_at) VALUES ('main', ?, datetime('now')) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
      [JSON.stringify(content)],
    );
    return { ok: true };
  });

/** Returns whether the caller is admin; the very first account to call this becomes admin. */
export const checkAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (isAdmin) return { isAdmin: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) > 0) return { isAdmin: false };
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    if (error) throw error;
    return { isAdmin: true };
  });
