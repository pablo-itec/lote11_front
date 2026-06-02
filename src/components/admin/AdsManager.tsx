"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import { adsApi } from "@/src/lib/api";
import type { Ad } from "@/src/types";
import ImageCropperModal from "@/src/components/ui/ImageCropperModal";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

type Side = "left" | "right";
type Size = "large" | "small";

const SIDE_LABEL: Record<Side, string> = { left: "Izquierda", right: "Derecha" };
const SIZE_LABEL: Record<Size, string> = { large: "Grande (3:6)", small: "Pequeño (14:9)" };
const CROP_ASPECT: Record<Size, number> = { large: 3 / 6, small: 14 / 9 };

const EMPTY_FORM = {
  side: "left" as Side,
  size: "small" as Size,
  linkUrl: "",
  displayDuration: 5,
  startsAt: "",
  endsAt: "",
};

export default function AdsManager({ onToast }: Props) {
  const [ads, setAds]             = useState<Ad[]>([]);
  const [filterSide, setFilterSide] = useState<Side>("left");
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cropSrc, setCropSrc]     = useState("");
  const [saving, setSaving]       = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try { setAds(await adsApi.getAdminAll()); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, side: filterSide });
    setImageFile(null);
    setPreviewUrl("");
    setShowForm(true);
  };

  const openEdit = (ad: Ad) => {
    setEditingId(ad.id);
    setForm({
      side: ad.side,
      size: ad.size,
      linkUrl: ad.linkUrl ?? "",
      displayDuration: ad.displayDuration,
      startsAt: ad.startsAt ? ad.startsAt.slice(0, 16) : "",
      endsAt: ad.endsAt ? ad.endsAt.slice(0, 16) : "",
    });
    setImageFile(null);
    setPreviewUrl(ad.imageUrl);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropConfirm = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCropSrc("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) { onToast("La imagen es requerida", false); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("side", form.side);
      fd.append("size", form.size);
      if (form.linkUrl) fd.append("linkUrl", form.linkUrl);
      fd.append("displayDuration", String(form.displayDuration));
      if (form.startsAt) fd.append("startsAt", new Date(form.startsAt).toISOString());
      if (form.endsAt) fd.append("endsAt", new Date(form.endsAt).toISOString());
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await adsApi.update(editingId, fd);
        onToast("Anuncio actualizado", true);
      } else {
        await adsApi.create(fd);
        onToast("Anuncio creado", true);
      }
      setShowForm(false);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este anuncio?")) return;
    try { await adsApi.remove(id); onToast("Anuncio eliminado", true); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  const handleReorder = async (ad: Ad, dir: -1 | 1) => {
    try { await adsApi.reorder(ad.id, ad.order + dir); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  const f = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const sideAds = ads.filter((a) => a.side === filterSide);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">
          Publicidades
        </h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo anuncio
        </button>
      </div>

      {/* Izquierda / Derecha tabs */}
      <div className="glass-panel rounded-[20px] p-1.5 flex gap-1">
        {(["left", "right"] as Side[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterSide(s)}
            className={`px-5 py-2 rounded-[14px] text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
              filterSide === s
                ? "bg-brand-brown text-brand-cream"
                : "text-brand-cream/35 hover:text-brand-cream/60"
            }`}
          >
            {SIDE_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar anuncio" : "Nuevo anuncio"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Side */}
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Lado *
              </label>
              <select value={form.side} onChange={f("side")} className="glass-input" disabled={!!editingId}>
                <option value="left">Izquierda</option>
                <option value="right">Derecha</option>
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Tamaño *
              </label>
              <select value={form.size} onChange={f("size")} className="glass-input">
                <option value="small">Pequeño (14:9)</option>
                <option value="large">Grande (3:5)</option>
              </select>
            </div>

            {/* Link */}
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                URL de destino
              </label>
              <input value={form.linkUrl} onChange={f("linkUrl")} className="glass-input" placeholder="https://..." />
            </div>

            {/* Duration */}
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Duración (seg)
              </label>
              <input type="number" min={1} value={form.displayDuration} onChange={f("displayDuration")} className="glass-input" />
            </div>

            {/* Dates */}
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Desde</label>
              <input type="datetime-local" value={form.startsAt} onChange={f("startsAt")} className="glass-input" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Hasta</label>
              <input type="datetime-local" value={form.endsAt} onChange={f("endsAt")} className="glass-input" />
            </div>

            {/* Image */}
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Imagen {editingId ? "(vacío = mantener actual)" : "*"}
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button type="button" onClick={() => fileRef.current?.click()} className="abtn abtn-edit flex items-center gap-2">
                <ImageIcon size={11} />
                {imageFile ? imageFile.name : "Seleccionar imagen"}
              </button>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="mt-2 rounded-xl object-cover" style={{ maxHeight: 120, maxWidth: 200 }} />
              )}
            </div>

            {/* Actions */}
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="abtn abtn-edit px-5 py-2">
                {saving ? "Guardando..." : editingId ? "Guardar" : "Crear"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="abtn abtn-del px-5 py-2">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ads list */}
      <div className="glass-panel rounded-[28px] overflow-hidden">
        {loading ? (
          <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
        ) : sideAds.length === 0 ? (
          <p className="text-center py-8 text-[11px] text-brand-cream/30">
            Sin anuncios en este lado.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Tamaño</th>
                <th>Destino</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sideAds.map((ad, idx) => (
                <tr key={ad.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ad.imageUrl} alt="" className="rounded-lg object-cover" style={{ width: 60, height: 40 }} />
                  </td>
                  <td>
                    <span className={`abadge ${ad.size === "large" ? "abadge-brown" : "abadge-gray"}`}>
                      {SIZE_LABEL[ad.size]}
                    </span>
                  </td>
                  <td className="text-[11px] max-w-[160px] truncate">
                    {ad.linkUrl ? (
                      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="text-brand-brown hover:underline">
                        {ad.linkUrl}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="text-[11px]">
                    {ad.startsAt ? new Date(ad.startsAt).toLocaleDateString("es-AR") : "—"}
                  </td>
                  <td className="text-[11px]">
                    {ad.endsAt ? new Date(ad.endsAt).toLocaleDateString("es-AR") : "—"}
                  </td>
                  <td>
                    <div className="flex gap-0.5">
                      <button onClick={() => handleReorder(ad, -1)} disabled={idx === 0} className="abtn abtn-edit disabled:opacity-30 p-1">
                        <ChevronUp size={11} />
                      </button>
                      <button onClick={() => handleReorder(ad, 1)} disabled={idx === sideAds.length - 1} className="abtn abtn-edit disabled:opacity-30 p-1">
                        <ChevronDown size={11} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(ad)} className="abtn abtn-edit">Editar</button>
                      <button onClick={() => handleDelete(ad.id)} className="abtn abtn-del">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {cropSrc && (
        <ImageCropperModal
          src={cropSrc}
          aspect={CROP_ASPECT[form.size]}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc("")}
        />
      )}
    </div>
  );
}
