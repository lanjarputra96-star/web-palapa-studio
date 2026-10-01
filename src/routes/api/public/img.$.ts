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
          const bytes = Uint8Array.from(atob(rows[0].data), (c) => c.charCodeAt(0));
          return new Response(bytes, { headers: { "Content-Type": rows[0].mime, "Cache-Control": "public, max-age=31536000, immutable" } });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
