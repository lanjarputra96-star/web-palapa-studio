import { createFileRoute } from "@tanstack/react-router";
import { d1Query, d1Source } from "@/lib/d1.server";

// Cek cepat sambungan database (tanpa menampilkan data rahasia).
export const Route = createFileRoute("/api/public/status")({
  server: {
    handlers: {
      GET: async () => {
        const source = await d1Source();
        let database = "ok";
        try {
          await d1Query("SELECT 1 AS ok");
        } catch (e) {
          database = e instanceof Error ? e.message.slice(0, 300) : "error";
        }
        return Response.json({ source, database }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
