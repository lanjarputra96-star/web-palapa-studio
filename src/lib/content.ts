export const photoSettings = { layout: "", photoSize: "", position: "", fit: "" };

export const defaultContent = {
  topbar: { visible: true, phone: "(021) 7889-4211", email: "SDN1Palapa@yahoo.co.id", hours: "Senin–Jumat, 07.00–15.00 WIB" },
  nav: {
    items: [
      { label: "Profil", target: "profil" },
      { label: "Guru", target: "guru" },
      { label: "Prestasi", target: "prestasi" },
      { label: "Berita", target: "berita" },
      { label: "Fasilitas", target: "fasilitas" },
      { label: "Layanan", target: "layanan" },
      { label: "Kontak", target: "kontak" },
    ],
  },
  header: { schoolName: "SD Negeri 1 Palapa", subtitle: "NPSN 10807499 · Akreditasi B", logo: "", coverImage: "", logoSettings: { ...photoSettings }, coverSettings: { ...photoSettings }, ctaLabel: "Info SPMB" },
  hero: {
    visible: true,
    badge: "Membangun generasi Berhatti",
    title: "Beriman, sehat, dan siap",
    highlight: "berprestasi.",
    description: "Ruang informasi, komunikasi, dan dokumentasi SD Negeri 1 Palapa untuk siswa, orang tua, guru, dan seluruh masyarakat.",
    primaryCta: "Daftar SPMB",
    secondaryCta: "Jelajahi Profil",
    newsVisible: true,
    newsTitle: "Kabar penting",
    newsMonth: "September 2026",
    news: [
      { date: "09", title: "Pembelajaran daring", copy: "Dampak abu vulkanik Gunung Anak Krakatau" },
      { date: "10", title: "Evaluasi pembelajaran", copy: "Perpanjangan KBM daring" },
      { date: "—", title: "Info sekolah", copy: "Pantau pengumuman resmi secara berkala" },
    ],
  },
  stats: {
    visible: true,
    items: [
      { value: "670", label: "Siswa aktif" },
      { value: "40", label: "Guru & tenaga ahli" },
      { value: "15", label: "Ekstrakurikuler & klub" },
      { value: "1961", label: "Tahun didirikan" },
    ],
  },
  profil: {
    visible: true,
    label: "Kepemimpinan sekolah",
    title: "Selamat datang di SD Negeri 1 Palapa",
    body: "Kami berkomitmen menghadirkan pendidikan yang menumbuhkan keimanan, kesehatan, karakter, dan prestasi peserta didik. Bersama seluruh warga sekolah dan orang tua, mari kita wujudkan generasi yang siap menghadapi masa depan.",
    name: "Taufik Hidayat, S.Pd.",
    role: "Kepala Sekolah",
    image: "",
    photoSettings: { ...photoSettings },
  },
  guru: {
    visible: true,
    label: "Tenaga pendidik",
    title: "Profil guru kami",
    description: "Kenali para pendidik yang membimbing siswa SD Negeri 1 Palapa setiap hari.",
    layout: "grid",
    photoSize: "sedang",
    position: "", fit: "",
    items: [{ name: "Taufik Hidayat, S.Pd.", role: "Kepala Sekolah", bio: "", image: "" }],
  },
  layanan: {
    visible: true,
    label: "Akses cepat",
    title: "Layanan & referensi",
    items: [
      { title: "Referensi Belajar", copy: "Tautan materi dan sumber belajar untuk mendukung kegiatan siswa.", buttonLabel: "", url: "", newTab: true },
      { title: "Informasi Pendidik", copy: "Kenali tenaga pendidik dan kependidikan SD Negeri 1 Palapa." },
      { title: "Kalender Sekolah", copy: "Ikuti jadwal kegiatan akademik dan agenda penting sekolah." },
    ],
  },
  berita: {
    visible: true,
    label: "Kabar & informasi",
    title: "Berita sekolah terkini",
    mainMeta: "Berita · 01 September 2026",
    mainTitle: "Tingkatkan minat baca, siswa kunjungi perpustakaan sekolah",
    mainCopy: "Kegiatan literasi terjadwal membangun kebiasaan membaca sejak dini.",
    mainImage: "",
    mainBody: "",
    mainGallery: "",
    mainPhotoSettings: { ...photoSettings },
    mainGallerySettings: { ...photoSettings },
    items: [
      { date: "09 September 2026", title: "Evaluasi Perpanjangan KBM Daring hingga 10 September 2026", body: "", gallery: "", gallerySettings: { ...photoSettings } },
      { date: "07 September 2026", title: "Aktivitas Vulkanik Krakatau Berdampak pada Kegiatan Pembelajaran" },
      { date: "09 September 2026", title: "Pembelajaran Daring Dampak Abu Vulkanik Gunung Anak Krakatau" },
    ],
  },
  prestasi: {
    visible: true,
    label: "Rekam jejak prestasi",
    title: "Ruang tumbuh, karya, dan pencapaian",
    layout: "", photoSize: "", position: "", fit: "",
    items: [
      { label: "Akademik", title: "Semangat berprestasi di bidang sains", image: "", copy: "" },
      { label: "Seni & budaya", title: "Merawat budaya melalui karya siswa", image: "", copy: "" },
      { label: "Literasi", title: "Membangun kebiasaan membaca bersama", image: "", copy: "" },
    ],
  },
  fasilitas: {
    visible: true,
    label: "Sarana & prasarana",
    title: "Fasilitas pendukung pembelajaran",
    items: [
      { title: "Ruang kelas", copy: "Ruang belajar yang nyaman", gallery: "", gallerySettings: { ...photoSettings } },
      { title: "Perpustakaan", copy: "Kunjungan siswa aktif terjadwal" },
      { title: "Lapangan olahraga", copy: "Basket, futsal, badminton, dan voli" },
      { title: "Musholah", copy: "Pusat ibadah dan kegiatan keagamaan" },
    ],
  },
  galeri: {
    visible: true, label: "Galeri", title: "Galeri sekolah", layout: "grid", photoSize: "sedang", position: "", fit: "",
    items: [{ title: "", image: "", youtube: "" }],
  },
  spmb: {
    visible: true,
    label: "Info SPMB",
    title: "Siap menjadi bagian dari SD Negeri 1 Palapa?",
    description: "Hubungi sekolah untuk memperoleh informasi resmi mengenai penerimaan murid baru.",
    cta: "Hubungi Sekolah",
  },
  susunan: {
    items: ["profil", "guru", "layanan", "berita", "prestasi", "fasilitas", "galeri"].map((section) => ({ section, visible: true })),
  },
  custom: {
    items: [{ visible: false, id: "visi-misi", label: "Tentang kami", title: "Visi & Misi", body: "", image: "", gallery: "", photoSettings: { ...photoSettings }, gallerySettings: { ...photoSettings } }],
  },
  footer: { visible: true, tagline: "Beriman, sehat, dan berprestasi — bersama membangun generasi masa depan." },
  peta: { visible: true, title: "Lokasi sekolah", address: "SD Negeri 1 Palapa" },
};

export type SiteContent = typeof defaultContent;

type Json = unknown;
function merge(base: Json, over: Json): Json {
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    const templates = base.filter((x) => x && typeof x === "object");
    const tpl = Object.assign({}, ...templates) as Record<string, Json>;
    const empty = (v: Json): Json => v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, empty(x)])) : typeof v === "boolean" ? v : "";
    return templates.length ? over.map((x) => merge(empty(tpl), x)) : over;
  }
  if (base && typeof base === "object") {
    const stored = over && typeof over === "object" && !Array.isArray(over) ? over as Record<string, Json> : {};
    const out: Record<string, Json> = { ...stored, ...(base as Record<string, Json>) };
    for (const k of Object.keys(base)) out[k] = merge((base as Record<string, Json>)[k], stored[k]);
    return out;
  }
  return typeof over === typeof base ? over : base;
}

export const mergeContent = (stored: unknown): SiteContent => merge(defaultContent, stored) as SiteContent;
