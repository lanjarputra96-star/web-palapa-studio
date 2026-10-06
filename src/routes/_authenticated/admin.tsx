import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { adminLogout, changePassword, getSiteContent, saveSiteContent, uploadImage as uploadImageFn } from "@/lib/content.functions";
import { defaultContent, type SiteContent } from "@/lib/content";
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
  susunan: "Susunan bagian halaman", custom: "Menu / bagian tambahan", fasilitas: "Fasilitas", spmb: "Info SPMB", footer: "Bagian bawah",
};
const fieldNames: Record<string, string> = {
  visible: "Tampilkan bagian ini", newsVisible: "Tampilkan kartu kabar", phone: "Telepon", email: "Email", hours: "Jam layanan",
  schoolName: "Nama sekolah", subtitle: "Keterangan", logo: "Logo sekolah", ctaLabel: "Tombol", badge: "Label kecil", title: "Judul", highlight: "Judul (berwarna)",
  description: "Deskripsi", primaryCta: "Tombol utama", secondaryCta: "Tombol kedua", newsTitle: "Judul kartu kabar", newsMonth: "Bulan",
  news: "Daftar kabar", items: "Daftar", value: "Angka", label: "Label", body: "Isi", name: "Nama", role: "Jabatan", copy: "Keterangan",
  date: "Tanggal", mainMeta: "Berita utama: tanggal", mainTitle: "Berita utama: judul", mainCopy: "Berita utama: ringkasan", cta: "Tombol", tagline: "Slogan", target: "Tujuan (id bagian)", image: "Foto", mainImage: "Berita utama: foto", bio: "Biografi singkat", mainBody: "Berita utama: isi lengkap", gallery: "Galeri foto", mainGallery: "Berita utama: galeri foto", buttonLabel: "Teks tombol", url: "Link tujuan tombol (https://...)", coverImage: "Foto sampul layar utama", layout: "Tampilan profil guru", photoSize: "Ukuran foto guru", section: "Bagian (profil, guru, layanan, berita, prestasi, fasilitas, spmb, atau ID menu tambahan)", id: "ID bagian (tanpa spasi, mis. visi-misi; isi juga di Menu navigasi sebagai tujuan)",
};

type Val = unknown;
const fieldOptions: Record<string, [string, string][]> = {
  layout: [["grid", "Kartu (grid)"], ["kolase", "Kolase"], ["dropdown", "Dropdown (buka-tutup)"], ["geser", "Geser ke samping"]],
  photoSize: [["kecil", "Kecil"], ["sedang", "Sedang"], ["besar", "Besar"]],
};
function Field({ k, value, onChange, def }: { k: string; value: Val; onChange: (v: Val) => void; def?: Val }) {
  const name = fieldNames[k] ?? k;
  const cls = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  if (typeof value === "boolean")
    return <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />{name}</label>;
  if (typeof value === "string" && fieldOptions[k])
    return <label className="block text-xs font-semibold text-muted-foreground">{name}<select value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"}>{fieldOptions[k]!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>;
  if (typeof value === "string" && /gallery$/i.test(k))
    return <GalleryField name={name} value={value} onChange={onChange} />;
  if (typeof value === "string" && /body$/i.test(k))
    return <label className="block text-xs font-semibold text-muted-foreground">{name}<textarea rows={10} value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"} /></label>;
  if (typeof value === "string" && (/image$/i.test(k) || k === "logo"))
    return <ImageField name={name} value={value} onChange={onChange} />;
  if (typeof value === "string")
    return <label className="block text-xs font-semibold text-muted-foreground">{name}
      {value.length > 70 ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls + " text-foreground"} />}
    </label>;
  if (Array.isArray(value)) {
    const itemDef = (Array.isArray(def) ? def[0] : undefined) as Record<string, Val> | undefined;
    const keys = new Set<string>(Object.keys(itemDef ?? {}));
    value.forEach((it) => it && typeof it === "object" && Object.keys(it).forEach((x) => keys.add(x)));
    const template = Object.fromEntries([...keys].map((x) => [x, typeof itemDef?.[x] === "boolean" ? false : ""]));
    return <div><p className="text-xs font-semibold text-muted-foreground">{name}</p>
      <div className="mt-2 space-y-3">
        {value.map((item, i) => <div key={i} className="rounded-md border border-border bg-muted/40 p-3">
          <Obj value={{ ...template, ...(item as Record<string, Val>) }} def={itemDef} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
          <button type="button" onClick={() => { if (confirm("Hapus item ini?")) onChange(value.filter((_, j) => j !== i)); }} className="mt-2 text-xs font-semibold text-destructive">Hapus item</button>
          {i > 0 && <button type="button" onClick={() => { const n = [...value]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }} className="ml-4 mt-2 text-xs font-semibold text-primary">↑ Naikkan</button>}
          {i < value.length - 1 && <button type="button" onClick={() => { const n = [...value]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }} className="ml-4 mt-2 text-xs font-semibold text-primary">↓ Turunkan</button>}
        </div>)}
        <button type="button" onClick={() => onChange([...value, template])} className="text-xs font-bold text-primary">+ Tambah item</button>
      </div></div>;
  }
  if (value && typeof value === "object") return <Obj value={value as Record<string, Val>} def={def} onChange={onChange} />;
  return null;
}
async function toBase64(file: File): Promise<{ mime: string; data: string }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const png = file.type === "image/png" && file.size < 300_000;
  let q = 0.85, url = canvas.toDataURL(png ? "image/png" : "image/jpeg", q);
  while (!png && url.length > 1_300_000 && q > 0.4) { q -= 0.15; url = canvas.toDataURL("image/jpeg", q); }
  return { mime: png ? "image/png" : "image/jpeg", data: url.split(",")[1] ?? "" };
}
async function uploadImage(file: File) {
  const { url } = await uploadImageFn({ data: await toBase64(file) });
  return url;
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
    try { onChange(await uploadImage(file)); } catch (e) { alert("Gagal mengunggah foto: " + (e as Error).message); }
    setBusy(false);
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
function Obj({ value, onChange, def }: { value: Record<string, Val>; onChange: (v: Val) => void; def?: Val }) {
  const d = (def && typeof def === "object" ? def : {}) as Record<string, Val>;
  return <div className="space-y-3">{Object.entries(value).map(([k, v]) => <Field key={k} k={k} value={v} def={d[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} />)}</div>;
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
    const r = await changePassword({ data: { current: cur, next: pw } }).catch(() => ({ ok: false }));
    if (!r.ok) setMsg("Gagal: periksa kata sandi lama Anda.");
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
  const logout = useServerFn(adminLogout);
  const load = useServerFn(getSiteContent);
  const save = useServerFn(saveSiteContent);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setAdmin(true); load().then(setContent);
  }, []);

  const signOut = async () => { await logout(); navigate({ to: "/auth", replace: true }); };
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
            <div className="mt-4"><Obj value={section as Record<string, Val>} def={(defaultContent as unknown as Record<string, Val>)[key]} onChange={(v) => { setContent({ ...content, [key]: v }); setStatus("Belum disimpan"); }} /></div>
          </details>
        ))}
      </main>
    </div>
  );
}
