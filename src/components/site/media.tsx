import { useState, type ReactNode } from "react";
import { Play, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { mediaGrid, photoClass, youtubeId, type PhotoSettings } from "@/lib/media";

export function Photo({ src, alt, settings = {}, fallback = "aspect-[4/3]", className = "" }: { src: string; alt: string; settings?: PhotoSettings; fallback?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const img = <img src={src} alt={alt} loading="lazy" className={`${photoClass(settings, fallback)} rounded-md ${className}`} />;
  const trigger = <Button variant="ghost" className="block h-auto w-full overflow-hidden p-0" aria-label={`Perbesar foto ${alt}`} onClick={() => setOpen(true)}>{img}</Button>;
  return <>
    {settings.layout === "dropdown" ? <details><summary className="cursor-pointer py-2 text-sm font-semibold text-primary">{alt || "Foto"}</summary>{trigger}</details> : trigger}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-5xl"><DialogTitle>{alt || "Foto"}</DialogTitle><img src={src} alt={alt} className="max-h-[75vh] w-full object-contain" /><a href={src} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">Buka foto asli ↗</a></DialogContent></Dialog>
  </>;
}

export function MediaCollection({ items, settings = {}, fallback, render }: { items: { title: string }[]; settings?: PhotoSettings; fallback?: string; render: (i: number) => ReactNode }) {
  return <div className={settings.layout === "dropdown" ? "space-y-3" : mediaGrid(settings, fallback)}>{items.map((item, i) => settings.layout === "dropdown" ? <details key={i} className="rounded-md border border-border bg-card p-4"><summary className="cursor-pointer font-semibold">{item.title || `Foto ${i + 1}`}</summary><div className="mt-4">{render(i)}</div></details> : <div key={i} className="min-w-0">{render(i)}</div>)}</div>;
}

export function PhotoGallery({ gallery = "", settings = {}, large = false }: { gallery?: string; settings?: PhotoSettings; large?: boolean }) {
  const list = gallery.split("\n").map((x) => x.trim()).filter(Boolean);
  if (!list.length) return null;
  return <div className="mt-5"><MediaCollection items={list.map((_, i) => ({ title: `Foto ${i + 1}` }))} settings={settings} fallback={large ? "grid gap-3" : "grid grid-cols-3 gap-2"} render={(i) => <Photo src={list[i] ?? ""} alt={`Foto ${i + 1}`} settings={{ ...settings, layout: "" }} fallback={large ? "aspect-[4/3]" : "aspect-square"} />} /></div>;
}

export function VideoTile({ url, title }: { url: string; title: string }) {
  const id = youtubeId(url);
  const [playing, setPlaying] = useState(false);
  if (!id) return <div className="grid aspect-video place-items-center bg-muted text-muted-foreground"><ImageIcon aria-label="Video tidak tersedia" /></div>;
  return playing ? <iframe className="aspect-video w-full rounded-md border-0" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title || "Video galeri sekolah"} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <Button variant="ghost" className="relative block h-auto w-full overflow-hidden p-0" onClick={() => setPlaying(true)} aria-label={`Putar ${title || "video"}`}><img className="aspect-video w-full object-cover" src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title || "Video YouTube"} loading="lazy" /><span className="absolute inset-0 grid place-items-center bg-foreground/20"><span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="size-6" /></span></span></Button>;
}