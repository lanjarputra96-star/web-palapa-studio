import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { checkAdmin, getSiteContent, saveSiteContent } from "@/lib/content.functions";
import type { SiteContent } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — SD Negeri 1 Palapa" },
      { name: "description", content: "Kelola judul, isi, dan tampilan bagian website SD Negeri 1 Palapa." },
      { property: "og:title", content: "Panel Admin — SD Negeri 1 Palapa" },
      { property: "og:description", content: "Kelola isi website sekolah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const sectionNames: Record<string, string> = {
  nav: "Menu navigasi", guru: "Profil guru", topbar: "Bar kontak atas", header: "Kepala halaman", hero: "Bagian pembuka", stats: "Statistik",
  profil: "Profil / sambutan", layanan: "Layanan", berita: "Berita", prestasi: "Prestasi",
  fasilitas: "Fasilitas", spmb: "Info SPMB", footer: "Bagian bawah",
};
const fieldNames: Record<string, string> = {
  visible: "Tampilkan bagian ini", newsVisible: "Tampilkan kartu kabar", phone: "Telepon", email: "Email", hours: "Jam layanan",
  schoolName: "Nama sekolah", subtitle: "Keterangan", ctaLabel: "Tombol", badge: "Label kecil", title: "Judul", highlight: "Judul (berwarna)",
  description: "Deskripsi", primaryCta: "Tombol utama", secondaryCta: "Tombol kedua", newsTitle: "Judul kartu kabar", newsMonth: "Bulan",
  news: "Daftar kabar", items: "Daftar", value: "Angka", label: "Label", body: "Isi", name: "Nama", role: "Jabatan", copy: "Keterangan",
  date: "Tanggal", mainMeta: "Berita utama: tanggal", mainTitle: "Berita utama: judul", mainCopy: "Berita utama: ringkasan", cta: "Tombol", tagline: "Slogan", target: "Tujuan (id bagian)", image: "Foto", mainImage: "Berita utama: foto", bio: "Biografi singkat", body: "Isi berita lengkap", mainBody: "Berita utama: isi lengkap", gallery: "Galeri foto", mainGallery: "Berita utama: galeri foto", buttonLabel: "Teks tombol", url: "Link tujuan tombol (https://...)",
};

type Val = unknown;
function Field({ k, value, onChange }: { k: string; value: Val; onChange: (v: Val) => void }) {
  const name = fieldNames[k] ?? k;
  const cls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  if (typeof value === "boolean")
    return <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />{name}</label>;
  if (typeof value === "string" && /gallery$/i.test(k))
    return <GalleryField name={name} value={value} onChange={onChange} />;
  if (typeof value === "string" && /body$/i.test(k))
    return <label className="block text-xs font-semibold text-muted-foreground">{name}<textarea rows={10} value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"} /></label>;
  if (typeof value === "string" && /image$/i.test(k))
    return <ImageField name={name} value={value} onChange={onChange} />;
  if (typeof value === "string")
    return <label className="block text-xs font-semibold text-muted-foreground">{name}
      {value.length > 70 ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"} />}
    </label>;
  if (Array.isArray(value)) {
    const template = Object.fromEntries(Object.keys((value[0] as object) ?? {}).map((x) => [x, ""]));
    return <div><p className="text-xs font-semibold text-muted-foreground">{name}</p>
      <div className="mt-2 space-y-3">
        {value.map((item, i) => <div key={i} className="rounded-md border border-border bg-muted/40 p-3">
          <Obj value={item as Record<string, Val>} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
          <button type="button" onClick={() => { if (confirm("Hapus item ini?")) onChange(value.filter((_, j) => j !== i)); }} className="mt-2 text-xs font-semibold text-destructive">Hapus item</button>
        </div>)}
        <button type="button" onClick={() => onChange([...value, template])} className="text-xs font-bold text-primary">+ Tambah item</button>
      </div></div>;
  }
  if (value && typeof value === "object") return <Obj value={value as Record<string, Val>} onChange={onChange} />;
  return null;
}
async function uploadImage(file: File) {
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${file.name.replace(/[^\w.\-]/g, "_")}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return `/api/public/img/${path}`;
}
function GalleryField({ name, value, onChange }: { name: string; value: string; onChange: (v: Val) => void }) {
  const [busy, setBusy] = useState(false);
  const list = value.split("\n").filter(Boolean);
  const add = async (files: File[]) => {
    setBusy(true);
    try { const urls = []; for (const f of files) urls.push(await uploadImage(f)); onChange([...list, ...urls].join("\n")); }
    catch (e) { alert("Gagal mengunggah foto: " + (e as Error).message); }
    setBusy(false);
  };
  return <div><p className="text-xs font-semibold text-muted-foreground">{name}</p>
    <div className="mt-2 flex flex-wrap items-center gap-3">
      {list.map((u, i) => <div key={i} className="relative"><img src={u} alt="" className="size-16 rounded-md object-cover" />
        <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i).join("\n"))} className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-destructive text-[10px] text-destructive-foreground">✕</button></div>)}
      <label className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold">
        {busy ? "Mengunggah…" : "+ Tambah foto (bisa pilih banyak)"}
        <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) add(f); e.target.value = ""; }} />
      </label>
    </div></div>;
}
function ImageField({ name, value, onChange }: { name: string; value: string; onChange: (v: Val) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    const path = `${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return alert("Gagal mengunggah foto: " + error.message);
    onChange(`/api/public/img/${path}`);
  };
  return <div><p className="text-xs font-semibold text-muted-foreground">{name}</p>
    <div className="mt-2 flex items-center gap-3">
      {value ? <img src={value} alt="" className="size-16 rounded-md object-cover" /> : <span className="grid size-16 place-items-center rounded-md bg-muted text-[10px] text-muted-foreground">Bawaan</span>}
      <label className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold">
        {busy ? "Mengunggah…" : "Unggah dari komputer"}
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      </label>
      {value && <button type="button" onClick={() => onChange("")} className="text-xs font-semibold text-destructive">Hapus foto</button>}
    </div></div>;
}
function Obj({ value, onChange }: { value: Record<string, Val>; onChange: (v: Val) => void }) {
  return <div className="space-y-3">{Object.entries(value).map(([k, v]) => <Field key={k} k={k} value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />)}</div>;
}

function PasswordSettings() {
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const cls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return setMsg("Kata sandi baru minimal 6 karakter.");
    setMsg("Menyimpan…");
    const { error } = await supabase.auth.updateUser({ password: pw, current_password: cur } as Parameters<typeof supabase.auth.updateUser>[0]);
    if (error) setMsg("Gagal: periksa kata sandi lama Anda.");
    else { setMsg("Kata sandi berhasil diganti ✓"); setCur(""); setPw(""); }
  };
  return (
    <details className="rounded-md border border-border bg-card p-5">
      <summary className="cursor-pointer font-display font-semibold">Pengaturan akun: ganti kata sandi</summary>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block text-xs font-semibold text-muted-foreground">Kata sandi lama<input type="password" required value={cur} onChange={(e) => setCur(e.target.value)} className={cls} /></label>
        <label className="block text-xs font-semibold text-muted-foreground">Kata sandi baru<input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} className={cls} /></label>
        <div className="flex items-center gap-3"><Button type="submit">Ganti kata sandi</Button><span className="text-xs text-muted-foreground">{msg}</span></div>
      </form>
    </details>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const check = useServerFn(checkAdmin);
  const load = useServerFn(getSiteContent);
  const save = useServerFn(saveSiteContent);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    check().then((r) => { setAdmin(r.isAdmin); if (r.isAdmin) load().then(setContent); }).catch(() => setAdmin(false));
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); };
  const onSave = async () => {
    if (!content) return;
    setStatus("Menyimpan…");
    try { await save({ data: content }); setStatus("Tersimpan ✓"); } catch { setStatus("Gagal menyimpan. Coba lagi."); }
  };

  if (admin === null) return <p className="p-10 text-sm text-muted-foreground">Memuat…</p>;
  if (!admin) return <div className="p-10"><p className="font-semibold">Akun ini tidak memiliki akses admin.</p><Button onClick={signOut} className="mt-4">Keluar</Button></div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-5 py-3">
          <strong className="font-display">Panel Admin</strong>
          <Link to="/" className="text-xs font-semibold text-primary">Lihat website ↗</Link>
          <span className="ml-auto text-xs text-muted-foreground">{status}</span>
          <Button onClick={onSave} disabled={!content}>Simpan perubahan</Button>
          <Button variant="outline" onClick={signOut}>Keluar</Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-4 px-5 py-8">
        <PasswordSettings />
        {!content ? <p className="text-sm text-muted-foreground">Memuat isi…</p> : Object.entries(content).map(([key, section]) => (
          <details key={key} className="rounded-md border border-border bg-card p-5" open={key === "hero"}>
            <summary className="cursor-pointer font-display font-semibold">
              {sectionNames[key] ?? key}
              {"visible" in (section as object) && !(section as { visible: boolean }).visible && <span className="ml-2 text-xs font-normal text-muted-foreground">(disembunyikan)</span>}
            </summary>
            <div className="mt-4"><Obj value={section as Record<string, Val>} onChange={(v) => { setContent({ ...content, [key]: v }); setStatus("Belum disimpan"); }} /></div>
          </details>
        ))}
      </main>
    </div>
  );
}
