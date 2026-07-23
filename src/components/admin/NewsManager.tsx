"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, X, Trash2 } from "lucide-react";
import { newsApi, topicsApi, importanceApi } from "@/src/lib/api";
import { imgSrc, fmt } from "@/src/lib/utils";
import type { News, NewsImage, Topic, ImportanceLevel } from "@/src/types";

const MAX_GALLERY_IMAGES = 10;
const MAX_TOTAL_IMAGES = MAX_GALLERY_IMAGES + 1; // portada + galería

interface StagedImage {
  file: File;
  previewUrl: string;
}

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY_FORM = {
  title: "", subtitle: "", body: "", author: "", slug: "",
  status: "draft" as "draft" | "published",
  featured: false,
  importanceLevelId: "",
  topicId: "",
  tags: "",
  imageCaption: "",
};

export default function NewsManager({ onToast }: Props) {
  const [newsList, setNewsList]     = useState<News[]>([]);
  const [topics, setTopics]         = useState<Topic[]>([]);
  const [levels, setLevels]         = useState<ImportanceLevel[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [saving, setSaving]         = useState(false);
  const [coverUrl, setCoverUrl]     = useState<string | null>(null);
  const [galleryImages, setGalleryImages]     = useState<NewsImage[]>([]);
  const [galleryStagedFiles, setGalleryStagedFiles] = useState<StagedImage[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [res, t, l] = await Promise.all([
        newsApi.getAll({ limit: 100 }),
        topicsApi.getAll(),
        importanceApi.getAll(),
      ]);
      setNewsList(res.data ?? []);
      setTopics(t);
      setLevels(l);
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetStagedGallery = () => {
    setGalleryStagedFiles((prev) => {
      prev.forEach((s) => URL.revokeObjectURL(s.previewUrl));
      return [];
    });
  };

  const closeForm = () => {
    resetStagedGallery();
    setShowForm(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setCoverUrl(null);
    setGalleryImages([]);
    resetStagedGallery();
    setShowForm(true);
  };

  const openEdit = (n: News) => {
    setEditingId(n.id);
    setForm({
      title: n.title,
      subtitle: n.subtitle ?? "",
      body: n.body,
      author: n.author ?? "",
      slug: n.slug ?? "",
      status: n.status,
      featured: n.featured,
      importanceLevelId: n.importanceLevelId ? String(n.importanceLevelId) : "",
      topicId: n.topicId ? String(n.topicId) : "",
      tags: (n.tags ?? []).join(", "),
      imageCaption: n.imageCaption ?? "",
    });
    setCoverUrl(n.imageUrl ?? null);
    setGalleryImages(n.images ?? []);
    resetStagedGallery();
    setShowForm(true);
  };

  // La primera imagen que se sube (portada libre) queda como portada; el resto entra a la galería.
  // Si ya existe la noticia (edit), sube directo; si no (create), guarda localmente
  // y se sube recién cuando se crea la noticia en handleSubmit.
  const handleGalleryFiles = async (files: File[]) => {
    let imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    if (editingId) {
      setGalleryUploading(true);
      if (!coverUrl && imageFiles.length > 0) {
        const [first, ...rest] = imageFiles;
        imageFiles = rest;
        try {
          const fd = new FormData();
          fd.append("image", first);
          const updated = await newsApi.update(editingId, fd);
          setCoverUrl(updated.imageUrl ?? null);
        } catch (err) {
          onToast((err as Error).message, false);
        }
      }
      const room = MAX_GALLERY_IMAGES - galleryImages.length;
      if (imageFiles.length > room) {
        onToast(`Máximo ${MAX_GALLERY_IMAGES} imágenes en la galería`, false);
      }
      for (const file of imageFiles.slice(0, Math.max(room, 0))) {
        try {
          const fd = new FormData();
          fd.append("image", file);
          const created = await newsApi.addImage(editingId, fd);
          setGalleryImages((prev) => [...prev, created]);
        } catch (err) {
          onToast((err as Error).message, false);
        }
      }
      setGalleryUploading(false);
    } else {
      const room = MAX_TOTAL_IMAGES - galleryStagedFiles.length;
      if (room <= 0) {
        onToast(`Máximo ${MAX_TOTAL_IMAGES} imágenes por noticia`, false);
        return;
      }
      const toStage = imageFiles
        .slice(0, room)
        .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
      setGalleryStagedFiles((prev) => [...prev, ...toStage]);
    }
  };

  const handleGalleryFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    await handleGalleryFiles(files);
  };

  const handleGalleryDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    await handleGalleryFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemoveGalleryImage = async (imageId: number) => {
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;
    try {
      await newsApi.removeImage(imageId);
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
      onToast("Imagen eliminada", true);
    } catch (err) {
      onToast((err as Error).message, false);
    }
  };

  const handleRemoveStagedFile = (index: number) => {
    setGalleryStagedFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("body", form.body);
    fd.append("status", form.status);
    fd.append("featured", String(form.featured));
    if (form.subtitle) fd.append("subtitle", form.subtitle);
    if (form.author) fd.append("author", form.author);
    if (form.slug) fd.append("slug", form.slug);
    if (form.imageCaption) fd.append("imageCaption", form.imageCaption);
    if (form.tags) fd.append("tags", form.tags);
    if (form.importanceLevelId) fd.append("importanceLevelId", form.importanceLevelId);
    if (form.topicId) fd.append("topicId", form.topicId);
    // La primera imagen subida (staged) es la portada; el resto va a la galería tras crear.
    if (!editingId && galleryStagedFiles.length > 0) {
      fd.append("image", galleryStagedFiles[0].file);
    }

    try {
      if (editingId) {
        await newsApi.update(editingId, fd);
        onToast("Noticia actualizada", true);
      } else {
        const created = await newsApi.create(fd);
        onToast("Noticia creada", true);
        for (const staged of galleryStagedFiles.slice(1)) {
          try {
            const gfd = new FormData();
            gfd.append("image", staged.file);
            await newsApi.addImage(created.id, gfd);
          } catch (err) {
            onToast(`Error subiendo imagen de galería: ${(err as Error).message}`, false);
          }
        }
      }
      closeForm();
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (n: News) => {
    try {
      n.status === "draft" ? await newsApi.publish(n.id) : await newsApi.unpublish(n.id);
      load();
    } catch (err) { onToast((err as Error).message, false); }
  };

  const toggleFeatured = async (id: number) => {
    try { await newsApi.toggleFeatured(id); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  const deleteNews = async (id: number) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    try { await newsApi.remove(id); onToast("Noticia eliminada", true); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  const f = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Noticias</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nueva
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar noticia" : "Nueva noticia"}
            </h3>
            <button onClick={closeForm} className="text-brand-cream/30 hover:text-brand-cream transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Título *</label>
              <input required value={form.title} onChange={f("title")} className="glass-input" placeholder="Título de la noticia" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Copete</label>
              <input value={form.subtitle} onChange={f("subtitle")} className="glass-input" placeholder="Bajada o subtítulo" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Cuerpo *</label>
              <textarea required value={form.body} onChange={f("body")} className="glass-input" style={{ minHeight: 120 }} placeholder="Contenido de la noticia" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Autor</label>
              <input value={form.author} onChange={f("author")} className="glass-input" placeholder="Nombre del autor" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Slug</label>
              <input value={form.slug} onChange={f("slug")} className="glass-input" placeholder="url-de-la-noticia (auto)" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Estado</label>
              <select value={form.status} onChange={f("status")} className="glass-input">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Tema</label>
              <select value={form.topicId} onChange={f("topicId")} className="glass-input">
                <option value="">Sin tema</option>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Importancia</label>
              <select value={form.importanceLevelId} onChange={f("importanceLevelId")} className="glass-input">
                <option value="">Sin nivel</option>
                {levels.map((l) => <option key={l.id} value={l.id}>Niv.{l.level} — {l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Tags (separados por coma)</label>
              <input value={form.tags} onChange={f("tags")} className="glass-input" placeholder="real estate, inversión, ..." />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="nf-feat"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-[#7A4A2A]"
              />
              <label htmlFor="nf-feat" className="text-[11px] text-brand-cream/50 cursor-pointer">
                Marcar como destacada
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Imágenes — la primera que subís se muestra primero (portada); con más de 1 se arma un carrusel
              </label>
              {(() => {
                const count = editingId ? (coverUrl ? 1 : 0) + galleryImages.length : galleryStagedFiles.length;
                const atCap = count >= MAX_TOTAL_IMAGES;
                return (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleGalleryDrop}
                    onClick={() => !atCap && galleryFileRef.current?.click()}
                    className={`border border-dashed border-white/15 rounded-[14px] p-3 transition-colors ${atCap ? "opacity-40" : "cursor-pointer hover:border-white/30"}`}
                  >
                    <div className="flex flex-wrap gap-2 mb-1">
                      {count === 0 && (
                        <p className="text-[10px] text-brand-cream/30 py-2">
                          Arrastrá imágenes acá o hacé click para seleccionar
                        </p>
                      )}
                      {editingId && coverUrl && (
                        <div className="relative h-[80px] w-[80px] rounded-[10px] overflow-hidden border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgSrc(coverUrl)} alt="Portada" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {editingId
                        ? galleryImages.map((img) => (
                            <div key={img.id} className="relative h-[80px] w-[80px] rounded-[10px] overflow-hidden border border-white/10 group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgSrc(img.imageUrl)} alt={img.caption ?? ""} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveGalleryImage(img.id); }}
                                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={11} className="text-white" />
                              </button>
                            </div>
                          ))
                        : galleryStagedFiles.map((staged, i) => (
                            <div key={staged.previewUrl} className="relative h-[80px] w-[80px] rounded-[10px] overflow-hidden border border-white/10 group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={staged.previewUrl} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveStagedFile(i); }}
                                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={11} className="text-white" />
                              </button>
                            </div>
                          ))}
                    </div>
                    <input
                      ref={galleryFileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFileInput}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden"
                    />
                    <p className="text-[9px] text-brand-cream/30">
                      {galleryUploading ? "Subiendo..." : `${count}/${MAX_TOTAL_IMAGES} imágenes`}
                    </p>
                  </div>
                );
              })()}
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Epígrafe imagen</label>
              <input value={form.imageCaption} onChange={f("imageCaption")} className="glass-input" placeholder="Descripción de la primera imagen" />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="abtn abtn-edit px-6 py-2">
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear noticia"}
              </button>
              <button type="button" onClick={closeForm} className="abtn abtn-del px-6 py-2">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
          ) : newsList.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin noticias.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Dest.</th>
                  <th>Tema</th>
                  <th>Importancia</th>
                  <th>Autor</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <div className="max-w-[200px]">
                        <p className="font-medium text-brand-cream/75 truncate">{n.title}</p>
                        {n.slug && <p className="text-[9px] text-brand-brown/60 truncate">{n.slug}</p>}
                      </div>
                    </td>
                    <td>
                      <span className={`abadge ${n.status === "published" ? "abadge-green" : "abadge-gray"}`}>
                        {n.status === "published" ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleFeatured(n.id)}
                        className={`abtn ${n.featured ? "abtn-edit" : "abtn-notify"}`}
                      >
                        {n.featured ? "★" : "☆"}
                      </button>
                    </td>
                    <td className="text-[11px]">{n.topic?.name ?? "—"}</td>
                    <td className="text-[11px]">{n.importanceLevel ? `Niv.${n.importanceLevel.level}` : "—"}</td>
                    <td className="text-[11px]">{n.author ?? "—"}</td>
                    <td className="text-[11px] whitespace-nowrap">{fmt(n.createdAt)}</td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => openEdit(n)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => togglePublish(n)} className={`abtn ${n.status === "draft" ? "abtn-pub" : "abtn-notify"}`}>
                          {n.status === "draft" ? "Publicar" : "Borrador"}
                        </button>
                        <button onClick={() => deleteNews(n.id)} className="abtn abtn-del">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
