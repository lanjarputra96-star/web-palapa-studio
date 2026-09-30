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
  header: { schoolName: "SD Negeri 1 Palapa", subtitle: "NPSN 10807499 · Akreditasi B", logo: "", ctaLabel: "Info SPMB" },
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
  },
  guru: {
    visible: true,
    label: "Tenaga pendidik",
    title: "Profil guru kami",
    description: "Kenali para pendidik yang membimbing siswa SD Negeri 1 Palapa setiap hari.",
    items: [{ name: "Taufik Hidayat, S.Pd.", role: "Kepala Sekolah", bio: "", image: "" }],
  },
  layanan: {
    visible: true,
    label: "Akses cepat",
    title: "Layanan & referensi",
    items: [
      { title: "Referensi Belajar", copy: "Tautan materi dan sumber belajar untuk mendukung kegiatan siswa.", buttonLabel: "", url: "" },
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
    items: [
      { date: "09 September 2026", title: "Evaluasi Perpanjangan KBM Daring hingga 10 September 2026", body: "", gallery: "" },
      { date: "07 September 2026", title: "Aktivitas Vulkanik Krakatau Berdampak pada Kegiatan Pembelajaran" },
      { date: "09 September 2026", title: "Pembelajaran Daring Dampak Abu Vulkanik Gunung Anak Krakatau" },
    ],
  },
  prestasi: {
    visible: true,
    label: "Rekam jejak prestasi",
    title: "Ruang tumbuh, karya, dan pencapaian",
    items: [
      { label: "Akademik", title: "Semangat berprestasi di bidang sains", image: "" },
      { label: "Seni & budaya", title: "Merawat budaya melalui karya siswa", image: "" },
      { label: "Literasi", title: "Membangun kebiasaan membaca bersama", image: "" },
    ],
  },
  fasilitas: {
    visible: true,
    label: "Sarana & prasarana",
    title: "Fasilitas pendukung pembelajaran",
    items: [
      { title: "Ruang kelas", copy: "Ruang belajar yang nyaman", gallery: "" },
      { title: "Perpustakaan", copy: "Kunjungan siswa aktif terjadwal" },
      { title: "Lapangan olahraga", copy: "Basket, futsal, badminton, dan voli" },
      { title: "Musholah", copy: "Pusat ibadah dan kegiatan keagamaan" },
    ],
  },
  spmb: {
    visible: true,
    label: "Info SPMB",
    title: "Siap menjadi bagian dari SD Negeri 1 Palapa?",
    description: "Hubungi sekolah untuk memperoleh informasi resmi mengenai penerimaan murid baru.",
    cta: "Hubungi Sekolah",
  },
  footer: { visible: true, tagline: "Beriman, sehat, dan berprestasi — bersama membangun generasi masa depan." },
};

export type SiteContent = typeof defaultContent;

type Json = unknown;
function merge(base: Json, over: Json): Json {
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    const tpl = base[0];
    return tpl && typeof tpl === "object" ? over.map((x) => merge(Object.fromEntries(Object.keys(tpl).map((k) => [k, typeof (tpl as Record<string, Json>)[k] === "boolean" ? false : ""])), x)) : over;
  }
  if (base && typeof base === "object") {
    const out: Record<string, Json> = { ...(base as Record<string, Json>) };
    if (over && typeof over === "object" && !Array.isArray(over)) {
      for (const k of Object.keys(out)) out[k] = merge(out[k], (over as Record<string, Json>)[k]);
    }
    return out;
  }
  return typeof over === typeof base ? over : base;
}

export const mergeContent = (stored: unknown): SiteContent => merge(defaultContent, stored) as SiteContent;
