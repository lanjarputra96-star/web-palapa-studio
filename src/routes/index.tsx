import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, ChevronRight, Clock3, Mail, MapPin, Menu, Phone, Trophy, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import kepalaSekolah from "@/assets/kepala-sekolah-ilustrasi.jpg";
import prestasiSains from "@/assets/prestasi-sains.jpg";
import prestasiSeni from "@/assets/prestasi-seni.jpg";
import literasiSekolah from "@/assets/literasi-sekolah.jpg";

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
  component: Index,
});

const navItems = [
  ["Profil", "#profil"], ["Prestasi", "#prestasi"], ["Berita", "#berita"],
  ["Fasilitas", "#fasilitas"], ["Layanan", "#layanan"], ["Kontak", "#kontak"],
] as const;

const goTo = (target: string) => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/20">
      <div className="bg-school-navy text-primary-foreground">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5 text-xs text-primary-foreground/70 sm:px-6">
          <span className="font-display font-semibold text-primary-foreground">SD NEGERI 1 PALAPA</span>
          <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> (021) 7889-4211</span>
          <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> SDN1Palapa@yahoo.co.id</span>
          <span className="ml-auto hidden items-center gap-1.5 md:flex"><Clock3 className="size-3.5" /> Senin–Jumat, 07.00–15.00 WIB</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center gap-8 px-5 py-3 sm:px-6">
          <button aria-label="Kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 text-left">
            <span className="grid size-10 place-items-center rounded-md bg-primary/10 font-display text-base font-extrabold text-primary ring-1 ring-primary/20">P1</span>
            <span><strong className="block font-display text-sm sm:text-base">SD Negeri 1 Palapa</strong><small className="block text-[10px] text-muted-foreground">NPSN 10807499 · Akreditasi B</small></span>
          </button>
          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Navigasi utama">
            {navItems.map(([label, target]) => <button key={target} onClick={() => goTo(target)} className="text-[13px] font-semibold text-foreground/65 transition-colors hover:text-primary">{label}</button>)}
          </nav>
          <Button onClick={() => goTo("#spmb")} className="hidden bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-secondary sm:inline-flex">Info SPMB</Button>
          <Button size="icon" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} onClick={() => setMenuOpen((open) => !open)} className="ml-auto bg-muted text-foreground lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Navigasi ponsel">{navItems.map(([label, target]) => <button key={target} onClick={() => { goTo(target); setMenuOpen(false); }} className="block w-full border-b border-border py-3 text-left text-sm font-semibold last:border-0">{label}</button>)}</nav>}
      </header>

      <main>
        <section className="hero-surface relative overflow-hidden pb-24 pt-14 text-primary-foreground sm:pt-20">
          <div className="absolute -right-20 -top-32 size-96 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/80 ring-1 ring-primary-foreground/10">Membangun generasi Berhatti</p>
              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-[54px]">Beriman, sehat, dan siap <span className="text-primary">berprestasi.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/70">Ruang informasi, komunikasi, dan dokumentasi SD Negeri 1 Palapa untuk siswa, orang tua, guru, dan seluruh masyarakat.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={() => goTo("#spmb")} className="h-12 bg-primary-foreground px-6 text-school-navy hover:bg-primary-foreground/90">Daftar SPMB <ArrowRight className="ml-2 size-4" /></Button>
                <Button onClick={() => goTo("#profil")} className="h-12 bg-primary-foreground/10 px-6 text-primary-foreground ring-1 ring-primary-foreground/20 hover:bg-primary-foreground/15">Jelajahi Profil</Button>
              </div>
            </div>
            <div className="glass-panel rounded-md border border-primary-foreground/15 p-5 shadow-soft">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 font-display text-sm font-semibold"><CalendarDays className="size-4 text-primary" /> Kabar penting</span><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground/50">September 2026</span></div>
              <div className="mt-5 space-y-3">
                {[['09','Pembelajaran daring','Dampak abu vulkanik Gunung Anak Krakatau'],['10','Evaluasi pembelajaran','Perpanjangan KBM daring'],['—','Info sekolah','Pantau pengumuman resmi secara berkala']].map(([date,title,copy]) => <div key={title} className="flex gap-4 rounded-md bg-primary-foreground/10 p-4"><span className="font-display text-xl font-bold text-primary-foreground">{date}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-primary-foreground/60">{copy}</p></div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto -mt-10 max-w-[1180px] px-5 sm:px-6" aria-label="Statistik sekolah">
          <div className="grid grid-cols-2 gap-6 rounded-md border border-border bg-card p-6 shadow-soft md:grid-cols-4 md:p-8">
            {[['670','Siswa aktif'],['40','Guru & tenaga ahli'],['15','Ekstrakurikuler & klub'],['1961','Tahun didirikan']].map(([value,label]) => <div key={label}><strong className="font-display text-3xl text-primary sm:text-[34px]">{value}</strong><p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p></div>)}
          </div>
        </section>

        <section id="profil" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <p className="section-label">Kepemimpinan sekolah</p>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[300px_1fr] lg:gap-12">
            <img src={kepalaSekolah} alt="Ilustrasi Kepala SD Negeri 1 Palapa" loading="lazy" width={640} height={760} className="aspect-[4/5] w-full rounded-md object-cover shadow-soft" />
            <div className="rounded-md border border-border bg-card p-7 sm:p-9">
              <h2 className="text-2xl font-bold">Selamat datang di SD Negeri 1 Palapa</h2>
              <p className="mt-4 leading-7 text-foreground/70">Kami berkomitmen menghadirkan pendidikan yang menumbuhkan keimanan, kesehatan, karakter, dan prestasi peserta didik. Bersama seluruh warga sekolah dan orang tua, mari kita wujudkan generasi yang siap menghadapi masa depan.</p>
              <p className="mt-6 font-display font-semibold">Taufik Hidayat, S.Pd.</p><p className="text-xs text-muted-foreground">Kepala Sekolah</p>
            </div>
          </div>
        </section>

        <section id="layanan" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <div className="flex items-end justify-between"><div><p className="section-label">Akses cepat</p><h2 className="mt-2 text-3xl font-bold">Layanan & referensi</h2></div><button onClick={() => goTo("#kontak")} className="hidden text-sm font-bold text-primary sm:block">Hubungi sekolah <ArrowRight className="ml-1 inline size-4" /></button></div>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[{icon:BookOpen,title:'Referensi Belajar',copy:'Tautan materi dan sumber belajar untuk mendukung kegiatan siswa.'},{icon:Users,title:'Informasi Pendidik',copy:'Kenali tenaga pendidik dan kependidikan SD Negeri 1 Palapa.'},{icon:CalendarDays,title:'Kalender Sekolah',copy:'Ikuti jadwal kegiatan akademik dan agenda penting sekolah.'}].map(({icon:Icon,title,copy}) => <article key={title} className="rounded-md border border-border bg-card p-7 transition-transform hover:-translate-y-1"><span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </section>

        <section id="berita" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 pt-20 sm:px-6">
          <p className="section-label">Kabar & informasi</p><h2 className="mt-2 text-3xl font-bold">Berita sekolah terkini</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <article className="overflow-hidden rounded-md border border-border bg-card"><img src={literasiSekolah} alt="Siswa membaca bersama di taman sekolah" loading="lazy" width={912} height={736} className="aspect-[16/9] w-full object-cover" /><div className="p-6"><p className="section-label">Berita · 01 September 2026</p><h3 className="mt-2 text-xl font-semibold">Tingkatkan minat baca, siswa kunjungi perpustakaan sekolah</h3><p className="mt-2 text-sm text-muted-foreground">Kegiatan literasi terjadwal membangun kebiasaan membaca sejak dini.</p></div></article>
            <div className="grid gap-4">{[['09 September 2026','Evaluasi Perpanjangan KBM Daring hingga 10 September 2026'],['07 September 2026','Aktivitas Vulkanik Krakatau Berdampak pada Kegiatan Pembelajaran'],['09 September 2026','Pembelajaran Daring Dampak Abu Vulkanik Gunung Anak Krakatau']].map(([date,title]) => <article key={title} className="rounded-md border border-border bg-card p-5"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">{date}</p><h3 className="mt-2 text-base font-semibold leading-6">{title}</h3><button className="mt-4 inline-flex items-center text-xs font-bold text-primary">Baca selengkapnya <ChevronRight className="size-4" /></button></article>)}</div>
          </div>
        </section>

        <section id="prestasi" className="scroll-mt-24 mx-auto max-w-[1180px] px-5 py-20 sm:px-6">
          <p className="section-label">Rekam jejak prestasi</p><h2 className="mt-2 text-3xl font-bold">Ruang tumbuh, karya, dan pencapaian</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[{image:prestasiSains,alt:'Siswa memegang piala lomba sains',label:'Akademik',title:'Semangat berprestasi di bidang sains'},{image:prestasiSeni,alt:'Siswa menampilkan tari tradisional Lampung',label:'Seni & budaya',title:'Merawat budaya melalui karya siswa'},{image:literasiSekolah,alt:'Siswa membaca bersama',label:'Literasi',title:'Membangun kebiasaan membaca bersama'}].map((item) => <article key={item.title} className="overflow-hidden rounded-md border border-border bg-card"><img src={item.image} alt={item.alt} loading="lazy" width={912} height={736} className="aspect-[16/10] w-full object-cover" /><div className="p-5"><p className="section-label">{item.label}</p><h3 className="mt-2 text-base font-semibold">{item.title}</h3></div></article>)}
          </div>
        </section>

        <section id="fasilitas" className="scroll-mt-24 border-y border-border bg-card"><div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6"><p className="section-label">Sarana & prasarana</p><h2 className="mt-2 text-3xl font-bold">Fasilitas pendukung pembelajaran</h2><div className="mt-8 grid gap-px overflow-hidden rounded-md bg-border sm:grid-cols-2 lg:grid-cols-4">{[['Ruang kelas','Ruang belajar yang nyaman'],['Perpustakaan','Kunjungan siswa aktif terjadwal'],['Lapangan olahraga','Basket, futsal, badminton, dan voli'],['Musholah','Pusat ibadah dan kegiatan keagamaan']].map(([title,copy]) => <div key={title} className="bg-background p-6"><MapPin className="size-5 text-primary" /><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>)}</div></div></section>

        <section id="spmb" className="scroll-mt-24 bg-school-navy text-primary-foreground"><div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-14 sm:px-6 md:grid-cols-[1.2fr_.8fr]"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Info SPMB</p><h2 className="mt-3 text-3xl font-bold">Siap menjadi bagian dari SD Negeri 1 Palapa?</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/65">Hubungi sekolah untuk memperoleh informasi resmi mengenai penerimaan murid baru.</p></div><Button onClick={() => goTo("#kontak")} className="h-12 justify-self-start bg-primary px-7 text-primary-foreground hover:bg-primary/90 md:justify-self-end">Hubungi Sekolah <ArrowRight className="ml-2 size-4" /></Button></div></section>
      </main>

      <footer id="kontak" className="scroll-mt-24 bg-background"><div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-10 sm:px-6 md:flex-row md:items-center md:justify-between"><div><p className="font-display font-bold">SD Negeri 1 Palapa</p><p className="mt-1 text-xs text-muted-foreground">NPSN 10807499 · Terakreditasi B</p></div><div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground"><span>(021) 7889-4211</span><span>SDN1Palapa@yahoo.co.id</span><span>Senin–Jumat, 07.00–15.00 WIB</span></div></div></footer>
    </div>
  );
}
