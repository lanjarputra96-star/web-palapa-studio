import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("Email atau kata sandi salah.");
      else navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setMsg(error ? error.message : "Akun dibuat. Periksa email Anda untuk konfirmasi, lalu masuk.");
    }
    setBusy(false);
  };

  const input = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="hero-surface grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-md border border-border bg-card p-7 text-card-foreground shadow-soft">
        <p className="section-label">Panel admin</p>
        <h1 className="mt-2 text-2xl font-bold">{mode === "login" ? "Masuk" : "Buat akun admin"}</h1>
        <label className="mt-6 block text-sm font-semibold">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} /></label>
        <label className="mt-4 block text-sm font-semibold">Kata sandi<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={input} /></label>
        {msg && <p className="mt-4 text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" disabled={busy} className="mt-6 h-11 w-full">{busy ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar"}</Button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 w-full text-center text-xs font-semibold text-primary">
          {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
        <Link to="/" className="mt-3 block text-center text-xs text-muted-foreground">← Kembali ke website</Link>
      </form>
    </div>
  );
}
