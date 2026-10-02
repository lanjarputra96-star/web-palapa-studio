import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { defaultContent, mergeContent } from "./content";
import { d1Query } from "./d1.server";
import { createSession, currentAdmin, destroySession, newImageId, requireAdmin, setPassword, verifyPassword, ensureTables } from "./auth.server";

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
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid content");
    return data as Record<string, unknown>;
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const content = mergeContent(data);
    await d1Query("CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT)");
    await d1Query(
      "INSERT INTO site_content (id, data, updated_at) VALUES ('main', ?, datetime('now')) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
      [JSON.stringify(content)],
    );
    return { ok: true };
  });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const username = data.username.trim().toLowerCase();
    try {
      if (!(await verifyPassword(username, data.password))) return { ok: false, error: null as string | null };
      await createSession(username);
      return { ok: true, error: null as string | null };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  });

export const adminMe = createServerFn({ method: "POST" }).handler(async () => {
  try { return { username: await currentAdmin() }; } catch (e) { console.error(e); return { username: null }; }
});

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await destroySession();
  return { ok: true };
});

export const changePassword = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ current: z.string().min(1).max(200), next: z.string().min(6).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const u = await requireAdmin();
    if (!(await verifyPassword(u, data.current))) return { ok: false };
    await setPassword(u, data.next);
    return { ok: true };
  });

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ mime: z.string().regex(/^image\/[\w.+-]+$/), data: z.string().max(1_400_000) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureTables();
    const id = newImageId();
    await d1Query("INSERT INTO site_images (id, mime, data) VALUES (?, ?, ?)", [id, data.mime, data.data]);
    return { url: `/api/public/img/${id}` };
  });
