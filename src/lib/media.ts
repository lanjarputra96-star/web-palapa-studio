export type PhotoSettings = { layout?: string; photoSize?: string; position?: string; fit?: string };

export function youtubeId(value: string): string | null {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const host = u.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? u.pathname.split("/")[1] : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host) ? u.searchParams.get("v") || (/^\/(shorts|embed|live)\//.test(u.pathname) ? u.pathname.split("/")[2] : "") : "";
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function photoClass(settings: PhotoSettings = {}, fallback = "aspect-[4/3]") {
  const size = ({ kecil: "max-h-48", sedang: "max-h-96", besar: "max-h-[640px]", asli: "h-auto" } as Record<string, string>)[settings.photoSize ?? ""];
  const fit = settings.fit === "cover" ? "object-cover" : settings.fit === "contain" || settings.photoSize === "asli" ? "object-contain" : "object-cover";
  const pos = ({ atas: "object-top", bawah: "object-bottom", kiri: "object-left", kanan: "object-right" } as Record<string, string>)[settings.position ?? ""] ?? "object-center";
  return `w-full ${settings.photoSize === "asli" ? "h-auto" : fallback} ${size ?? ""} ${fit} ${pos}`;
}

export function mediaGrid(settings: PhotoSettings = {}, fallback = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3") {
  if (!settings.layout) return fallback;
  if (settings.layout === "geser") return "flex snap-x gap-5 overflow-x-auto pb-4 [&>*]:w-72 [&>*]:max-w-[85vw] [&>*]:shrink-0 [&>*]:snap-start";
  if (settings.layout === "kolase") return "grid grid-flow-dense gap-4 sm:grid-cols-3 lg:grid-cols-4 [&>*:nth-child(3n+1)]:sm:col-span-2";
  return settings.photoSize === "kecil" ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" : settings.photoSize === "besar" ? "grid gap-6 sm:grid-cols-2" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";
}