"use client";

// Tapa del mes: lista con una activa (la que se ve en el modal público).

import { useState, useEffect, useRef } from "react";
import { Plus, X, Image as ImageIcon, Star, ExternalLink } from "lucide-react";
import { coversApi } from "@/src/lib/api";
import type { Cover } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";
import ImageCropperModal from "@/src/components/ui/ImageCropperModal";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY = { name: "", role: "", quote: "", instagram: "", articleUrl: "", active: false };

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

// Formato en que se muestra la imagen en el modal público (columna vertical).
const CROP_ASPECT = 3 / 4;

export default function CoversManager({ onToast }: Props) {
  const [items, setItems] = useState<Cover[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cropSrc, setCropSrc] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await coversApi.getAll());
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY });
    setImageFile(null);
    setPreviewUrl("");
    setShowForm(true);
  };

  const openEdit = (it: Cover) => {
    setEditingId(it.id);
    setForm({
      name: it.name,
      role: it.role ?? "",
      quote: it.quote ?? "",
      instagram: it.instagram ?? "",
      articleUrl: it.articleUrl ?? "",
      active: it.active,
    });
    setImageFile(null);
    setPreviewUrl(it.imageUrl ? imgSrc(it.imageUrl) : "");
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
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.role) fd.append("role", form.role);
      if (form.quote) fd.append("quote", form.quote);
      if (form.instagram) fd.append("instagram", form.instagram);
      if (form.articleUrl) fd.append("articleUrl", form.articleUrl);
      fd.append("active", String(form.active));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await coversApi.update(editingId, fd);
        onToast("Tapa actualizada", true);
      } else {
        await coversApi.create(fd);
        onToast("Tapa creada", true);
      }
      setShowForm(false);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await coversApi.activate(id);
      onToast("Tapa marcada como activa", true);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta tapa?")) return;
    try {
      await coversApi.remove(id);
      onToast("Tapa eliminada", true);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">
          Tapa del mes
        </h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nueva tapa
        </button>
      </div>

      <p className="text-[10px] text-brand-cream/35 leading-relaxed">
        La tapa marcada como activa es la que se muestra en el modal público. Marcar una como
        activa desactiva automáticamente a la anterior.
      </p>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar tapa" : "Nueva tapa"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-brand-cream/30 hover:text-brand-cream"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Nombre *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="glass-input"
                placeholder="Ana Gómez"
              />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Rol / cargo (opcional)
              </label>
              <input
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="glass-input"
                placeholder="Arquitecta"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Frase / descripción de la nota
              </label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
                className="glass-input min-h-[70px]"
                placeholder="Una frase de la nota o una breve descripción."
              />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Instagram (opcional)
              </label>
              <input
                value={form.instagram}
                onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                className="glass-input"
                placeholder="@usuario o link al perfil"
              />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Link a la nota (opcional)
              </label>
              <input
                value={form.articleUrl}
                onChange={(e) => setForm((p) => ({ ...p, articleUrl: e.target.value }))}
                className="glass-input"
                placeholder="https://…"
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                id="cover-active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
              />
              <label htmlFor="cover-active" className="text-[10px] text-brand-cream/50">
                Activa (visible en el sitio)
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Imagen {editingId ? "(vacío = mantener actual)" : ""}
              </label>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="abtn abtn-edit flex items-center gap-2"
              >
                <ImageIcon size={11} />
                {imageFile ? imageFile.name : "Seleccionar imagen"}
              </button>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 rounded-xl object-cover"
                  style={{ width: 105, height: 140 }}
                />
              )}
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="abtn abtn-edit px-5 py-2">
                {saving ? "Guardando..." : editingId ? "Guardar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="abtn abtn-del px-5 py-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin tapas.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Nota</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <span className={`abadge ${it.active ? "abadge-brown" : "abadge-gray"}`}>
                        {it.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td>
                      {it.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgSrc(it.imageUrl)}
                          alt=""
                          className="rounded-lg object-cover"
                          style={{ width: 42, height: 56 }}
                        />
                      ) : (
                        <span className="text-[11px] text-brand-cream/20">—</span>
                      )}
                    </td>
                    <td className="font-medium text-brand-cream/70">{it.name}</td>
                    <td className="text-[11px] text-brand-cream/50">{it.role ?? "—"}</td>
                    <td className="text-[11px]">
                      {it.articleUrl ? (
                        <a
                          href={it.articleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-brown hover:underline"
                        >
                          <ExternalLink size={11} /> ver
                        </a>
                      ) : (
                        <span className="text-brand-cream/20">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {!it.active && (
                          <button
                            onClick={() => handleActivate(it.id)}
                            className="abtn abtn-edit flex items-center gap-1"
                          >
                            <Star size={11} /> Activar
                          </button>
                        )}
                        <button onClick={() => openEdit(it)} className="abtn abtn-edit">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(it.id)} className="abtn abtn-del">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {cropSrc && (
        <ImageCropperModal
          src={cropSrc}
          aspect={CROP_ASPECT}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc("")}
        />
      )}
    </div>
  );
}
