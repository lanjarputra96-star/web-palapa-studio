import { createFileRoute } from "@tanstack/react-router";
import { Photo, PhotoGallery, MediaCollection, VideoTile } from "@/components/site/media";
import { photoClass, type PhotoSettings } from "@/lib/media";
import { Fragment, useState, type ReactNode } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteContent } from "@/lib/content.functions";
import { ArrowRight, BookOpen, CalendarDays, ChevronRight, Clock3, Mail, MapPin, Menu, Phone, Trophy, Users, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import kepalaSekolah from "@/assets/kepala-sekolah-ilustrasi.jpg";
import prestasiSains from "@/assets/prestasi-sains.jpg";
import prestasiSeni from "@/assets/prestasi-seni.jpg";
import literasiSekolah from "@/assets/literasi-sekolah.jpg";

const contentQuery = queryOptions({ queryKey: ["site-content"], queryFn: () => getSiteContent() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SD Negeri 1 Palapa — Beriman, Sehat, Berprestasi" },
      { name: "description", content: "Website resmi SD Negeri 1 Palapa: profil, prestasi, berita, fasilitas, layanan digital, dan informasi SPMB." },
      { property: "og:title", content: "SD Negeri 1 Palapa" },
      { property: "og:description", content: "Informasi sekolah untuk siswa, orang tua, guru, dan masyarakat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  errorComponent: () => <p className="p-10">Gagal memuat halaman.</p>,
  notFoundComponent: () => <p className="p-10">Tidak ditemukan.</p>,
  component: Index,
});


const goTo = (target: string) => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: c } = useSuspenseQuery(contentQuery);
  const tel = "tel:" + c.topbar.phone.replace(/[^0-9+]/g, "");
  const prestasiImgs = [prestasiSains, prestasiSeni, literasiSekolah];
  const navItems = c.nav.items.map((n) => [n.label, "#" + n.target.replace(/^#/, "")] as const);
  if (c.galeri.visible && c.galeri.items.some((item) => item.image || item.youtube) && !navItems.some(([, target]) => target === "#galeri")) navItems.push(["Galeri", "#galeri"]);
  const layananIcons = [BookOpen, Users, CalendarDays];

  const guruLayout = c.guru.layout || "grid";
  const imgCls = ({ kecil: "aspect-square", besar: "aspect-[3/4]" } as Record<string, string>)[c.guru.photoSize] ?? "aspect-[4/5]";
  const guruGrid = guruLayout === "kolase" ? "mt-8 grid auto-rows-auto gap-4 grid-flow-dense sm:grid-cols-3 lg:grid-cols-4" : guruLayout === "geser" ? "mt-8 flex snap-x gap-5 overflow-x-auto pb-4 [&>*]:w-64 [&>*]:shrink-0 [&>*]:snap-start" : c.guru.photoSize === "besar" ? "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : c.guru.photoSize === "kecil" ? "mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4";
  const blocks: Record<string, ReactNode> = {
        profil: c.profil.visible && (<section id="profil" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <p className="section-label">{c.profil.label}</p>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[300px_1fr] lg:gap-12">
            <Photo src={c.profil.image || kepalaSekolah} alt={c.profil.name} settings={c.profil.photoSettings} fallback="aspect-[4/5]" className="shadow-soft" />
            <div className="rounded-md border border-border bg-card p-7 sm:p-9">
              <h2 className="text-2xl font-bold">{c.profil.title}</h2>
              <p className="mt-4 leading-7 text-foreground/70 whitespace-pre-line">{c.profil.body}</p>
              <p className="mt-6 font-display font-semibold">{c.profil.name}</p><p className="text-xs text-muted-foreground">{c.profil.role}</p>
            </div>
          </div>
        </section>),

        guru: c.guru.visible && (<section id="guru" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <p className="section-label">{c.guru.label}</p><h2 className="mt-2 text-3xl font-bold">{c.guru.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{c.guru.description}</p>
          {guruLayout === "dropdown" ? <GuruDropdown items={c.guru.items} settings={c.guru} /> : <div className={guruGrid}>
            {c.guru.items.map((g, i) => <article key={i} className={"overflow-hidden  rounded-md border border-border bg-card transition-transform hover:-translate-y-1" + (guruLayout === "kolase" && i % 3 === 0 ? " sm:col-span-2 sm:row-span-2" : "")}>
              {g.image ? <Photo src={g.image} alt={g.name} settings={{ ...c.guru, layout: "" }} fallback={imgCls} /> : <div className={imgCls + " grid w-full place-items-center bg-primary/10 font-display text-4xl font-bold text-primary"}>{g.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}</div>}
              <div className="p-5"><h3 className="font-display text-base font-semibold">{g.name}</h3><p className="text-xs font-semibold text-primary">{g.role}</p>{g.bio && <p className="mt-2 text-sm leading-6 text-muted-foreground">{g.bio}</p>}</div>
            </article>)}
          </div>}
        </section>),

        layanan: c.layanan.visible && (<section id="layanan" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <div className="flex items-end justify-between"><div><p className="section-label">{c.layanan.label}</p><h2 className="mt-2 text-3xl font-bold">{c.layanan.title}</h2></div><button onClick={() => goTo("#kontak")} className="hidden text-sm font-bold text-primary sm:block">Hubungi sekolah <ArrowRight className="ml-1 inline size-4" /></button></div>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {c.layanan.items.map(({title,copy,buttonLabel,url,newTab},i) => { const Icon = layananIcons[i % 3] ?? BookOpen; return <article key={i} className="flex flex-col rounded-md border border-border bg-card p-7 transition-transform hover:-translate-y-1"><span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>{url && <a href={url} className={buttonVariants({ className: "mt-5 self-start" })} target={newTab === false ? "_self" : "_blank"} rel={newTab === false ? undefined : "noopener noreferrer"}>{buttonLabel || "Buka tautan"} <ArrowRight className="size-4" /></a>}</article>; })}
          </div>
        </section>),

        berita: c.berita.visible && (<section id="berita" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <p className="section-label">{c.berita.label}</p><h2 className="mt-2 text-3xl font-bold">{c.berita.title}</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <article className="overflow-hidden rounded-md border border-border bg-card"><Photo src={c.berita.mainImage || literasiSekolah} alt={c.berita.mainTitle} settings={c.berita.mainPhotoSettings} fallback="aspect-[16/9]" /><div className="p-6"><p className="section-label">{c.berita.mainMeta}</p><h3 className="mt-2 text-xl font-semibold">{c.berita.mainTitle}</h3><p className="mt-2 text-sm text-muted-foreground">{c.berita.mainCopy}</p><NewsExtra body={c.berita.mainBody} gallery={c.berita.mainGallery} settings={c.berita.mainGallerySettings} /></div></article>
            <div className="grid gap-4">{c.berita.items.map(({date,title,body,gallery,gallerySettings},i) => <article key={i} className="rounded-md border border-border bg-card p-5"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">{date}</p><h3 className="mt-2 text-base font-semibold leading-6">{title}</h3>{body || gallery ? <NewsExtra body={body} gallery={gallery} settings={gallerySettings} /> : <button onClick={() => goTo("#kontak")} className="mt-4 inline-flex items-center text-xs font-bold text-primary">Tanyakan ke sekolah <ChevronRight className="size-4" /></button>}</article>)}</div>
          </div>
        </section>),

        prestasi: c.prestasi.visible && (<section id="prestasi" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 py-20 sm:px-6">
          <p className="section-label">{c.prestasi.label}</p><h2 className="mt-2 text-3xl font-bold">{c.prestasi.title}</h2>
          <div className="mt-8"><MediaCollection items={c.prestasi.items} settings={c.prestasi} fallback="grid gap-6 md:grid-cols-3" render={(i) => {
            const item = c.prestasi.items[i];
            if (!item) return null;
            return <article className="overflow-hidden rounded-md border border-border bg-card"><Photo src={item.image || prestasiImgs[i % 3] || prestasiSains} alt={item.title} settings={{ ...c.prestasi, layout: "" }} fallback="aspect-[16/10]" /><div className="p-5"><p className="section-label">{item.label}</p><h3 className="mt-2 text-base font-semibold">{item.title}</h3>{item.copy && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{item.copy}</p>}</div></article>;
          }} /></div>
        </section>),

        fasilitas: c.fasilitas.visible && (<section id="fasilitas" className="scroll-mt-24 border-y border-border bg-card"><div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6"><p className="section-label">{c.fasilitas.label}</p><h2 className="mt-2 text-3xl font-bold">{c.fasilitas.title}</h2><div className="mt-8 grid gap-px overflow-hidden rounded-md bg-border sm:grid-cols-2 lg:grid-cols-4">{c.fasilitas.items.map(({title,copy,gallery,gallerySettings},i) => <div key={i} className="bg-background p-6"><MapPin className="size-5 text-primary" /><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p><PhotoGallery gallery={gallery} settings={gallerySettings} large /></div>)}</div></div></section>),

        galeri: c.galeri.visible && c.galeri.items.some((item) => item.image || item.youtube) && <section id="galeri" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 py-20 sm:px-6"><p className="section-label">{c.galeri.label}</p><h2 className="mt-2 text-3xl font-bold">{c.galeri.title}</h2><div className="mt-8"><MediaCollection items={c.galeri.items.filter((item) => item.image || item.youtube)} settings={c.galeri} render={(i) => {
          const item = c.galeri.items.filter((item) => item.image || item.youtube)[i];
          if (!item) return null;
          return <article className="overflow-hidden rounded-md border border-border bg-card">{item.youtube ? <VideoTile url={item.youtube} title={item.title} /> : <Photo src={item.image} alt={item.title || "Galeri sekolah"} settings={{ ...c.galeri, layout: "" }} />}{item.title && <h3 className="p-4 text-sm font-semibold">{item.title}</h3>}</article>;
        }} /></div></section>,
  };
  for (const m of c.custom.items) if (m.id) blocks[m.id.replace(/^#/, "")] = m.visible && <CustomSection key={m.id} m={m} />;
  const order = c.susunan.items.map((x) => x.section.trim().replace(/^#/, "")).filter((k) => k in blocks);
  for (const k of Object.keys(blocks)) if (!order.includes(k)) order.push(k);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/20">
      {c.topbar.visible && <div className="bg-school-navy text-primary-foreground">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5 text-xs text-primary-foreground/70 sm:px-6">
          <span className="font-display font-semibold text-primary-foreground">{c.header.schoolName.toUpperCase()}</span>
          <a href={tel} className="flex items-center gap-1.5 hover:text-primary-foreground"><Phone className="size-3.5" /> {c.topbar.phone}</a>
          <a href={"mailto:" + c.topbar.email} className="flex items-center gap-1.5 hover:text-primary-foreground"><Mail className="size-3.5" /> {c.topbar.email}</a>
          <span className="ml-auto hidden items-center gap-1.5 md:flex"><Clock3 className="size-3.5" /> {c.topbar.hours}</span>
        </div>
      </div>}

      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center gap-8 px-5 py-3 sm:px-6">
          <button aria-label="Kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 text-left">
            {c.header.logo
              ? <img src={c.header.logo} alt={`Logo ${c.header.schoolName}`} className={(c.header.logoSettings.photoSize === "kecil" ? "size-8" : c.header.logoSettings.photoSize === "besar" ? "size-16" : "size-10") + " shrink-0 rounded-md object-contain"} />
              : <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 font-display text-base font-extrabold text-primary ring-1 ring-primary/20">P1</span>}
            <span><strong className="block font-display text-sm sm:text-base">{c.header.schoolName}</strong><small className="block text-[10px] text-muted-foreground">{c.header.subtitle}</small></span>
          </button>
          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Navigasi utama">
            {navItems.map(([label, target]) => <button key={target} onClick={() => goTo(target)} className="text-[13px] font-semibold text-foreground/65 transition-colors hover:text-primary">{label}</button>)}
          </nav>
          <Button onClick={() => goTo("#spmb")} className="hidden bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-secondary sm:inline-flex">{c.header.ctaLabel}</Button>
          <Button size="icon" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} onClick={() => setMenuOpen((open) => !open)} className="ml-auto bg-muted text-foreground lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Navigasi ponsel">{navItems.map(([label, target]) => <button key={target} onClick={() => { goTo(target); setMenuOpen(false); }} className="block w-full border-b border-border py-3 text-left text-sm font-semibold last:border-0">{label}</button>)}</nav>}
      </header>

      <main>
        {c.hero.visible && <section className="hero-surface relative overflow-hidden pb-24 pt-14 text-primary-foreground sm:pt-20">
          {c.header.coverImage && <img src={c.header.coverImage} alt="" className={photoClass(c.header.coverSettings, "h-full") + " absolute inset-0 opacity-35"} aria-hidden="true" />}
          <div className="absolute -right-20 -top-32 size-96 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/80 ring-1 ring-primary-foreground/10">{c.hero.badge}</p>
              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-[54px]">{c.hero.title} <span className="text-primary">{c.hero.highlight}</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/70">{c.hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={() => goTo("#spmb")} className="h-12 bg-primary-foreground px-6 text-school-navy hover:bg-primary-foreground/90">{c.hero.primaryCta} <ArrowRight className="ml-2 size-4" /></Button>
                <Button onClick={() => goTo("#profil")} className="h-12 bg-primary-foreground/10 px-6 text-primary-foreground ring-1 ring-primary-foreground/20 hover:bg-primary-foreground/15">{c.hero.secondaryCta}</Button>
              </div>
            </div>
            {c.hero.newsVisible && <div className="glass-panel rounded-md border border-primary-foreground/15 p-5 shadow-soft">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 font-display text-sm font-semibold"><CalendarDays className="size-4 text-primary" /> {c.hero.newsTitle}</span><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground/50">{c.hero.newsMonth}</span></div>
              <div className="mt-5 space-y-3">
                {c.hero.news.map(({date,title,copy},i) => <div key={i} className="flex gap-4 rounded-md bg-primary-foreground/10 p-4"><span className="font-display text-xl font-bold text-primary-foreground">{date}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-primary-foreground/60">{copy}</p></div></div>)}
              </div>
            </div>}
          </div>
        </section>}

        {c.stats.visible && <section className="relative mx-auto -mt-10 max-w-[1180px] px-5 sm:px-6" aria-label="Statistik sekolah">
          <div className="grid grid-cols-2 gap-6 rounded-md border border-border bg-card p-6 shadow-soft md:grid-cols-4 md:p-8">
            {c.stats.items.map(({value,label},i) => <div key={i}><strong className="font-display text-3xl text-primary sm:text-[34px]">{value}</strong><p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p></div>)}
          </div>
        </section>}

        {order.map((k) => <Fragment key={k}>{blocks[k]}</Fragment>)}
        {c.spmb.visible && <section id="spmb" className="scroll-mt-24 bg-school-navy text-primary-foreground"><div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-14 sm:px-6 md:grid-cols-[1.2fr_.8fr]"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c.spmb.label}</p><h2 className="mt-3 text-3xl font-bold">{c.spmb.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/65">{c.spmb.description}</p></div><Button onClick={() => goTo("#kontak")} className="h-12 justify-self-start bg-primary px-7 text-primary-foreground hover:bg-primary/90 md:justify-self-end">{c.spmb.cta} <ArrowRight className="ml-2 size-4" /></Button></div></section>}
      </main>

      {c.footer.visible && <footer id="kontak" className="scroll-mt-24 bg-background">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-bold">{c.header.schoolName}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.header.subtitle}</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{c.footer.tagline}</p>
          </div>
          <div>
            <p className="section-label">Hubungi kami</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={tel} className="flex items-center gap-2 transition-colors hover:text-primary"><Phone className="size-4 text-primary" /> {c.topbar.phone}</a></li>
              <li><a href={"mailto:" + c.topbar.email} className="flex items-center gap-2 break-all transition-colors hover:text-primary"><Mail className="size-4 shrink-0 text-primary" /> {c.topbar.email}</a></li>
              <li className="flex items-center gap-2"><Clock3 className="size-4 text-primary" /> {c.topbar.hours}</li>
            </ul>
          </div>
          <div>
            <p className="section-label">Jelajahi</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {navItems.map(([label, target]) => <li key={target}><button onClick={() => goTo(target)} className="text-foreground/70 transition-colors hover:text-primary">{label}</button></li>)}
            </ul>
          </div>
        </div>
        <div className="border-t border-border"><p className="mx-auto max-w-[1180px] px-5 py-5 text-xs text-muted-foreground sm:px-6">© {new Date().getFullYear()} {c.header.schoolName}. Seluruh hak dilindungi. · <a href="/auth" className="hover:text-primary">Login Admin</a></p></div>
      </footer>}
    </div>
  );
}

function NewsExtra({ body = "", gallery = "", settings }: { body?: string | undefined; gallery?: string | undefined; settings?: PhotoSettings }) {
  const [open, setOpen] = useState(false);
  if (!body && !gallery) return null;
  return <div>
    {open && <div className="mt-4 whitespace-pre-line text-sm leading-7 text-foreground">{body}</div>}
    {open && <PhotoGallery gallery={gallery} settings={settings} />}
    <button onClick={() => setOpen(!open)} className="mt-4 inline-flex items-center text-xs font-bold text-primary">{open ? "Tutup" : "Baca selengkapnya"} <ChevronRight className="size-4" /></button>
  </div>;
}

function GuruDropdown({ items, settings }: { items: { name: string; role: string; bio: string; image: string }[]; settings: PhotoSettings }) {
  return <div className="mt-8 space-y-3">{items.map((g, i) => <details key={i} className="group rounded-md border border-border bg-card p-4">
    <summary className="flex cursor-pointer items-center gap-3"><span className="font-display font-semibold">{g.name}</span><span className="text-xs font-semibold text-primary">{g.role}</span><ChevronRight className="ml-auto size-4 transition-transform group-open:rotate-90" /></summary>
    <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">{g.image && <Photo src={g.image} alt={g.name} settings={{ ...settings, layout: "" }} fallback="aspect-[4/5]" />}<p className="text-sm leading-6 text-muted-foreground whitespace-pre-line">{g.bio}</p></div>
  </details>)}</div>;
}

function CustomSection({ m }: { m: { id: string; label: string; title: string; body: string; image: string; gallery: string; photoSettings: PhotoSettings; gallerySettings: PhotoSettings } }) {
  return <section id={m.id.replace(/^#/, "")} className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
    {m.label && <p className="section-label">{m.label}</p>}<h2 className="mt-2 text-3xl font-bold">{m.title}</h2>
    <div className={"mt-7 grid gap-8" + (m.image ? " md:grid-cols-[1fr_1fr] md:items-start" : "")}>
      {m.image && <Photo src={m.image} alt={m.title} settings={m.photoSettings} className="shadow-soft" />}
      <div className="rounded-md border border-border bg-card p-7"><p className="whitespace-pre-line leading-7 text-foreground/75">{m.body}</p><PhotoGallery gallery={m.gallery} settings={m.gallerySettings} /></div>
    </div>
  </section>;
}
