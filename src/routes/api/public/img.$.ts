import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/img/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!/^[\w.\-]+$/.test(path)) return new Response("Not found", { status: 404 });
        const { d1Query } = await import("@/lib/d1.server");
        try {
          const rows = await d1Query<{ mime: string; data: string }>("SELECT mime, data FROM site_images WHERE id = ?", [path]);
          if (!rows[0]) return new Response("Not found", { status: 404 });
          let encoded = rows[0].data;
          const count = Number(rows[0].mime.split(";chunks=")[1] ?? 1);
          if (!Number.isInteger(count) || count < 1 || count > 17) return new Response("Not found", { status: 404 });
          if (count > 1) {
            const ids = Array.from({ length: count - 1 }, (_, i) => `${path}_p${i + 1}`);
            const parts = await d1Query<{ id: string; data: string }>(`SELECT id, data FROM site_images WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
            const byId = new Map(parts.map((part) => [part.id, part.data]));
            if (ids.some((id) => !byId.has(id))) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
            encoded += ids.map((id) => byId.get(id) ?? "").join("");
          }
          const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
          return new Response(bytes, { headers: { "Content-Type": rows[0].mime.split(";")[0] ?? "image/jpeg", "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable" } });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
