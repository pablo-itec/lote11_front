"use client";

// Tarjetero: directorio jerárquico en tres niveles —
// secciones, grupos y los ítems dentro de cada grupo.

import { useState, useEffect, useRef } from "react";
import { Plus, X, Image as ImageIcon, Users, ArrowLeft, Layers, Contact } from "lucide-react";
import { tarjeteroApi } from "@/src/lib/api";
import type { TarjeteroGroup, TarjeteroPerson, TarjeteroSection } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY_GROUP = { name: "", slug: "", description: "", order: 0, active: true, sectionId: "" as number | "" };
const EMPTY_PERSON = { name: "", role: "", email: "", order: 0, active: true };
const EMPTY_SECTION = { name: "", slug: "", description: "", priority: 0, active: true };

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

type View = "grupos" | "secciones";

export default function TarjeteroManager({ onToast }: Props) {
  const [groups, setGroups]     = useState<TarjeteroGroup[]>([]);
  const [sections, setSections] = useState<TarjeteroSection[]>([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState<View>("grupos");

  // Grupo seleccionado para gestionar sus ítems (null = vista de grupos)
  const [managingId, setManagingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [g, s] = await Promise.all([tarjeteroApi.getAll(), tarjeteroApi.getAllSections()]);
      setGroups(g);
      setSections(s);
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const managingGroup = groups.find((g) => g.id === managingId) ?? null;

  if (managingGroup) {
    return (
      <PeoplePanel
        group={managingGroup}
        onBack={() => setManagingId(null)}
        onChanged={load}
        onToast={onToast}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Sub-nav Grupos / Secciones */}
      <div className="glass-panel rounded-[16px] p-1 inline-flex gap-1">
        <SubTab active={view === "grupos"} onClick={() => setView("grupos")} icon={<Contact size={12} />} label="Grupos" />
        <SubTab active={view === "secciones"} onClick={() => setView("secciones")} icon={<Layers size={12} />} label="Secciones" />
      </div>

      {view === "grupos" ? (
        <GroupsPanel
          groups={groups}
          sections={sections}
          loading={loading}
          onChanged={load}
          onManage={(id) => setManagingId(id)}
          onToast={onToast}
        />
      ) : (
        <SectionsPanel
          sections={sections}
          loading={loading}
          onChanged={load}
          onToast={onToast}
        />
      )}
    </div>
  );
}

function SubTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-[12px] text-[9px] font-bold tracking-[0.15em] uppercase transition-all ${
        active ? "bg-brand-brown text-brand-cream" : "text-brand-cream/35 hover:text-brand-cream/60"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─────────────────────────  GRUPOS  ───────────────────────── */

function GroupsPanel({
  groups, sections, loading, onChanged, onManage, onToast,
}: {
  groups: TarjeteroGroup[];
  sections: TarjeteroSection[];
  loading: boolean;
  onChanged: () => void;
  onManage: (id: number) => void;
  onToast: (msg: string, ok: boolean) => void;
}) {
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_GROUP });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving]       = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const sectionName = (id?: number | null) => sections.find((s) => s.id === id)?.name ?? null;

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_GROUP });
    setImageFile(null);
    setPreviewUrl("");
    setShowForm(true);
  };

  const openEdit = (g: TarjeteroGroup) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      slug: g.slug,
      description: g.description ?? "",
      order: g.order,
      active: g.active,
      sectionId: g.sectionId ?? "",
    });
    setImageFile(null);
    setPreviewUrl(g.imageUrl ? imgSrc(g.imageUrl) : "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.slug) fd.append("slug", form.slug);
      if (form.description) fd.append("description", form.description);
      fd.append("order", String(form.order));
      fd.append("active", String(form.active));
      // Siempre se envía: vacío desasigna la sección en el back.
      fd.append("sectionId", form.sectionId === "" ? "" : String(form.sectionId));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) { await tarjeteroApi.updateGroup(editingId, fd); onToast("Grupo actualizado", true); }
      else { await tarjeteroApi.createGroup(fd); onToast("Grupo creado", true); }
      setShowForm(false);
      onChanged();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este grupo y todos sus ítems?")) return;
    try { await tarjeteroApi.removeGroup(id); onToast("Grupo eliminado", true); onChanged(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  // Solo secciones reales (con id) para el selector
  const realSections = sections.filter((s): s is TarjeteroSection & { id: number } => s.id != null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Tarjetero — Grupos</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo grupo
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar grupo" : "Nuevo grupo"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Nombre *</label>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="glass-input" placeholder="Constructora ACME" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Slug (opcional)</label>
              <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="glass-input" placeholder="se genera del nombre" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Sección</label>
              <select
                value={form.sectionId === "" ? "" : String(form.sectionId)}
                onChange={(e) => setForm((p) => ({ ...p, sectionId: e.target.value === "" ? "" : +e.target.value }))}
                className="glass-input"
              >
                <option value="">— Sin sección —</option>
                {realSections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Orden</label>
              <input type="number" min={0} value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} className="glass-input" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Descripción</label>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="glass-input" placeholder="Breve descripción del grupo" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input id="group-active" type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
              <label htmlFor="group-active" className="text-[10px] text-brand-cream/50">Activo</label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Imagen {editingId ? "(vacío = mantener actual)" : ""}
              </label>
              <input ref={fileRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} className="abtn abtn-edit flex items-center gap-2">
                <ImageIcon size={11} />
                {imageFile ? imageFile.name : "Seleccionar imagen"}
              </button>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="mt-2 rounded-xl object-cover" style={{ maxHeight: 120, maxWidth: 200 }} />
              )}
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="abtn abtn-edit px-5 py-2">
                {saving ? "Guardando..." : editingId ? "Guardar" : "Crear"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="abtn abtn-del px-5 py-2">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
          ) : groups.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin grupos.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Orden</th><th>Imagen</th><th>Nombre</th><th>Sección</th><th>Ítems</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g.id}>
                    <td className="text-[11px]">{g.order}</td>
                    <td>
                      {g.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc(g.imageUrl)} alt="" className="rounded-lg object-cover" style={{ width: 48, height: 48 }} />
                      ) : <span className="text-[11px] text-brand-cream/20">—</span>}
                    </td>
                    <td className="font-medium text-brand-cream/70">{g.name}</td>
                    <td className="text-[11px]">
                      {sectionName(g.sectionId) ? (
                        <span className="abadge abadge-brown">{sectionName(g.sectionId)}</span>
                      ) : <span className="text-brand-cream/25">— Sin sección —</span>}
                    </td>
                    <td className="text-[11px] text-brand-cream/50">{g.people?.length ?? 0}</td>
                    <td>
                      <span className={`abadge ${g.active ? "abadge-brown" : "abadge-gray"}`}>
                        {g.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => onManage(g.id)} className="abtn abtn-edit flex items-center gap-1"><Users size={11} /> Ítems</button>
                        <button onClick={() => openEdit(g)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => handleDelete(g.id)} className="abtn abtn-del">Eliminar</button>
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

/* ─────────────────────────  SECCIONES  ───────────────────────── */

function SectionsPanel({
  sections, loading, onChanged, onToast,
}: {
  sections: TarjeteroSection[];
  loading: boolean;
  onChanged: () => void;
  onToast: (msg: string, ok: boolean) => void;
}) {
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_SECTION });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving]       = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  // El bucket "sin sección" (id null) no se lista acá; solo secciones reales.
  const realSections = sections.filter((s): s is TarjeteroSection & { id: number } => s.id != null);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_SECTION });
    setImageFile(null);
    setPreviewUrl("");
    setShowForm(true);
  };

  const openEdit = (s: TarjeteroSection & { id: number }) => {
    setEditingId(s.id);
    setForm({
      name: s.name ?? "",
      slug: s.slug ?? "",
      description: s.description ?? "",
      priority: s.priority ?? 0,
      active: s.active,
    });
    setImageFile(null);
    setPreviewUrl(s.imageUrl ? imgSrc(s.imageUrl) : "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.slug) fd.append("slug", form.slug);
      if (form.description) fd.append("description", form.description);
      fd.append("priority", String(form.priority));
      fd.append("active", String(form.active));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) { await tarjeteroApi.updateSection(editingId, fd); onToast("Sección actualizada", true); }
      else { await tarjeteroApi.createSection(fd); onToast("Sección creada", true); }
      setShowForm(false);
      onChanged();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta sección? Sus grupos quedarán sin sección (no se borran).")) return;
    try { await tarjeteroApi.removeSection(id); onToast("Sección eliminada", true); onChanged(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Tarjetero — Secciones</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nueva sección
        </button>
      </div>

      <p className="text-[10px] text-brand-cream/35 leading-relaxed">
        Menor prioridad = más arriba en el menú. Dos secciones con la misma prioridad quedan en un orden
        aleatorio pero fijo (se define al crear y no cambia).
      </p>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar sección" : "Nueva sección"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Nombre *</label>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="glass-input" placeholder="Empresas" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Slug (opcional)</label>
              <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="glass-input" placeholder="se genera del nombre" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Prioridad</label>
              <input type="number" min={0} value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: +e.target.value }))} className="glass-input" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input id="section-active" type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
              <label htmlFor="section-active" className="text-[10px] text-brand-cream/50">Activa</label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Descripción</label>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="glass-input" placeholder="Breve descripción de la sección" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Imagen {editingId ? "(vacío = mantener actual)" : ""}
              </label>
              <input ref={fileRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} className="abtn abtn-edit flex items-center gap-2">
                <ImageIcon size={11} />
                {imageFile ? imageFile.name : "Seleccionar imagen"}
              </button>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="mt-2 rounded-xl object-cover" style={{ maxHeight: 120, maxWidth: 200 }} />
              )}
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="abtn abtn-edit px-5 py-2">
                {saving ? "Guardando..." : editingId ? "Guardar" : "Crear"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="abtn abtn-del px-5 py-2">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Cargando...</p>
          ) : realSections.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin secciones. Los grupos sin sección se muestran al final del menú.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Prioridad</th><th>Imagen</th><th>Nombre</th><th>Grupos</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {realSections.map((s) => (
                  <tr key={s.id}>
                    <td className="text-[11px]">{s.priority}</td>
                    <td>
                      {s.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc(s.imageUrl)} alt="" className="rounded-lg object-cover" style={{ width: 48, height: 48 }} />
                      ) : <span className="text-[11px] text-brand-cream/20">—</span>}
                    </td>
                    <td className="font-medium text-brand-cream/70">{s.name}</td>
                    <td className="text-[11px] text-brand-cream/50">{s.groups?.length ?? 0}</td>
                    <td>
                      <span className={`abadge ${s.active ? "abadge-brown" : "abadge-gray"}`}>
                        {s.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(s)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => handleDelete(s.id)} className="abtn abtn-del">Eliminar</button>
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

/* ─────────────────────────  ÍTEMS  ───────────────────────── */

function PeoplePanel({
  group, onBack, onChanged, onToast,
}: {
  group: TarjeteroGroup;
  onBack: () => void;
  onChanged: () => void;
  onToast: (msg: string, ok: boolean) => void;
}) {
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState({ ...EMPTY_PERSON });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving]       = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const people = group.people ?? [];

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_PERSON });
    setImageFile(null);
    setPreviewUrl("");
    setShowForm(true);
  };

  const openEdit = (p: TarjeteroPerson) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      role: p.role ?? "",
      email: p.email ?? "",
      order: p.order,
      active: p.active,
    });
    setImageFile(null);
    setPreviewUrl(p.imageUrl ? imgSrc(p.imageUrl) : "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.role) fd.append("role", form.role);
      if (form.email) fd.append("email", form.email);
      fd.append("order", String(form.order));
      fd.append("active", String(form.active));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) { await tarjeteroApi.updatePerson(editingId, fd); onToast("Ítem actualizado", true); }
      else { await tarjeteroApi.createPerson(group.id, fd); onToast("Ítem creado", true); }
      setShowForm(false);
      onChanged();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este ítem?")) return;
    try { await tarjeteroApi.removePerson(id); onToast("Ítem eliminado", true); onChanged(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="abtn abtn-del flex items-center gap-1"><ArrowLeft size={11} /> Grupos</button>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Ítems — {group.name}</h2>
        </div>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo ítem
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar ítem" : "Nuevo ítem"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Nombre *</label>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="glass-input" placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Oficio / Rol</label>
              <input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="glass-input" placeholder="Ingeniero civil" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Email de contacto</label>
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="glass-input" placeholder="juan@ejemplo.com" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Orden</label>
              <input type="number" min={0} value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} className="glass-input" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input id="person-active" type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
              <label htmlFor="person-active" className="text-[10px] text-brand-cream/50">Activo</label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">
                Foto {editingId ? "(vacío = mantener actual)" : ""}
              </label>
              <input ref={fileRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} className="abtn abtn-edit flex items-center gap-2">
                <ImageIcon size={11} />
                {imageFile ? imageFile.name : "Seleccionar imagen"}
              </button>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="mt-2 rounded-xl object-cover" style={{ width: 96, height: 96 }} />
              )}
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="abtn abtn-edit px-5 py-2">
                {saving ? "Guardando..." : editingId ? "Guardar" : "Crear"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="abtn abtn-del px-5 py-2">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          {people.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin ítems en este grupo.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Orden</th><th>Foto</th><th>Nombre</th><th>Oficio</th><th>Email</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.id}>
                    <td className="text-[11px]">{p.order}</td>
                    <td>
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc(p.imageUrl)} alt="" className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
                      ) : <span className="text-[11px] text-brand-cream/20">—</span>}
                    </td>
                    <td className="font-medium text-brand-cream/70">{p.name}</td>
                    <td className="text-[11px] text-brand-cream/50">{p.role ?? "—"}</td>
                    <td className="text-[11px] text-brand-cream/50 max-w-[180px] truncate">{p.email ?? "—"}</td>
                    <td>
                      <span className={`abadge ${p.active ? "abadge-brown" : "abadge-gray"}`}>
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="abtn abtn-del">Eliminar</button>
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
