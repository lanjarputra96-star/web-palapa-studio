import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminLogin } from "@/lib/content.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login Admin — SD Negeri 1 Palapa" },
      { name: "description", content: "Halaman masuk admin untuk mengelola isi website SD Negeri 1 Palapa." },
      { property: "og:title", content: "Login Admin — SD Negeri 1 Palapa" },
      { property: "og:description", content: "Masuk untuk mengelola isi website sekolah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const login = useServerFn(adminLogin);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await login({ data: { username: user, password } });
      setBusy(false);
      if (!r.ok) setMsg("Nama pengguna atau kata sandi salah.");
      else navigate({ to: "/admin" });
    } catch {
      setBusy(false);
      setMsg("Tidak dapat terhubung ke database. Periksa pengaturan Cloudflare.");
    }
  };

  const input = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="hero-surface grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-md border border-border bg-card p-7 text-card-foreground shadow-soft">
        <p className="section-label">Panel admin</p>
        <h1 className="mt-2 text-2xl font-bold">Masuk</h1>
        <label className="mt-6 block text-sm font-semibold">Nama pengguna<input required autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} className={input} /></label>
        <label className="mt-4 block text-sm font-semibold">Kata sandi<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} /></label>
        {msg && <p className="mt-4 text-sm text-destructive">{msg}</p>}
        <Button type="submit" disabled={busy} className="mt-6 h-11 w-full">{busy ? "Memproses…" : "Masuk"}</Button>
        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground">← Kembali ke website</Link>
      </form>
    </div>
  );
}
