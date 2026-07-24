"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { adLibraryApi } from "@/src/lib/api";
import type { AdLibraryImage } from "@/src/types";
import ImageCropperModal from "@/src/components/ui/ImageCropperModal";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

type Size = "large" | "small";

const SIZE_LABEL: Record<Size, string> = { small: "Pequeño (14:9)", large: "Grande (3:5)" };
// Mismos ratios que usan los anuncios de cada formato (ver SIZE_LABEL en AdsManager).
const SIZE_ASPECT: Record<Size, number> = { small: 14 / 9, large: 3 / 5 };
const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

export default function AdLibraryManager({ onToast }: Props) {
  const [activeSize, setActiveSize] = useState<Size>("small");
  const [images, setImages]     = useState<AdLibraryImage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc]   = useState("");
  const fileRef                 = useRef<HTMLInputElement>(null);

  const load = async (size: Size) => {
    setLoading(true);
    try { setImages(await adLibraryApi.getAll(size)); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(activeSize); }, [activeSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
  };

  const handleCropConfirm = async (file: File) => {
    setCropSrc("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("size", activeSize);
      const image = await adLibraryApi.create(fd);
      setImages((prev) => [image, ...prev]);
      onToast("Imagen agregada", true);
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta imagen de la biblioteca? Se quitará de cualquier anuncio que la use.")) return;
    try {
      await adLibraryApi.remove(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      onToast("Imagen eliminada", true);
    } catch (err) {
      onToast((err as Error).message, false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">
          Biblioteca de publicidades
        </h2>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="abtn abtn-edit flex items-center gap-1 disabled:opacity-40"
        >
          <Plus size={11} /> {uploading ? "Subiendo..." : "Subir imagen"}
        </button>
      </div>

      {/* Pequeño / Grande sub-tabs — cada formato tiene su propio set de imágenes */}
      <div className="glass-panel rounded-[20px] p-1.5 flex gap-1">
        {(["small", "large"] as Size[]).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSize(s)}
            className={`px-5 py-2 rounded-[14px] text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
              activeSize === s
                ? "bg-brand-brown text-brand-cream"
                : "text-brand-cream/35 hover:text-brand-cream/60"
            }`}
          >
            {SIZE_LABEL[s]}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-brand-cream/30">
        Subí una imagen una sola vez y elegí cuáles usar en cada anuncio de este formato desde la pestaña &quot;Publicidades&quot;.
      </p>

      <div className="glass-panel rounded-[28px] p-4">
        {loading ? (
          <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
        ) : images.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center gap-2 text-brand-cream/30">
            <ImageIcon size={20} />
            <p className="text-[11px]">Sin imágenes en este formato todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.label ?? ""}
                  className="rounded-xl object-cover w-full"
                  style={{ aspectRatio: SIZE_ASPECT[activeSize] }}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-1 right-1 bg-brand-red text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Eliminar imagen"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cropSrc && (
        <ImageCropperModal
          src={cropSrc}
          aspect={SIZE_ASPECT[activeSize]}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc("")}
        />
      )}
    </div>
  );
}
