"use client";

// Tarjetero: directorio de personas agrupadas por rubro.
// Dos niveles — grupos (rubros) y personal dentro de cada grupo.

import { useState, useEffect, useRef } from "react";
import { Plus, X, Image as ImageIcon, Users, ArrowLeft } from "lucide-react";
import { tarjeteroApi } from "@/src/lib/api";
import type { TarjeteroGroup, TarjeteroPerson } from "@/src/types";
import { imgSrc } from "@/src/lib/utils";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY_GROUP = { name: "", slug: "", description: "", order: 0, active: true };
const EMPTY_PERSON = { name: "", role: "", email: "", order: 0, active: true };

const ACCEPT = "image/jpeg,image/png,image/gif,image/webp";

export default function TarjeteroManager({ onToast }: Props) {
  const [groups, setGroups]   = useState<TarjeteroGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Grupo seleccionado para gestionar su personal (null = vista de grupos)
  const [managingId, setManagingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try { setGroups(await tarjeteroApi.getAll()); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
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
    <GroupsPanel
      groups={groups}
      loading={loading}
      onChanged={load}
      onManage={(id) => setManagingId(id)}
      onToast={onToast}
    />
  );
}

/* ─────────────────────────  GRUPOS  ───────────────────────── */

function GroupsPanel({
  groups, loading, onChanged, onManage, onToast,
}: {
  groups: TarjeteroGroup[];
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
      if (imageFile) fd.append("image", imageFile);

      if (editingId) { await tarjeteroApi.updateGroup(editingId, fd); onToast("Rubro actualizado", true); }
      else { await tarjeteroApi.createGroup(fd); onToast("Rubro creado", true); }
      setShowForm(false);
      onChanged();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este rubro y todo su personal?")) return;
    try { await tarjeteroApi.removeGroup(id); onToast("Rubro eliminado", true); onChanged(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Tarjetero — Rubros</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo rubro
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar rubro" : "Nuevo rubro"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Nombre *</label>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="glass-input" placeholder="Ingenieros" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Slug (opcional)</label>
              <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="glass-input" placeholder="se genera del nombre" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Descripción</label>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="glass-input" placeholder="Breve descripción del rubro" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Orden</label>
              <input type="number" min={0} value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} className="glass-input" />
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
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin rubros.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Orden</th><th>Imagen</th><th>Nombre</th><th>Personal</th><th>Estado</th><th>Acciones</th></tr>
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
                    <td className="text-[11px] text-brand-cream/50">{g.people?.length ?? 0}</td>
                    <td>
                      <span className={`abadge ${g.active ? "abadge-brown" : "abadge-gray"}`}>
                        {g.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => onManage(g.id)} className="abtn abtn-edit flex items-center gap-1"><Users size={11} /> Personal</button>
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

/* ─────────────────────────  PERSONAL  ───────────────────────── */

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

      if (editingId) { await tarjeteroApi.updatePerson(editingId, fd); onToast("Persona actualizada", true); }
      else { await tarjeteroApi.createPerson(group.id, fd); onToast("Persona creada", true); }
      setShowForm(false);
      onChanged();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta persona?")) return;
    try { await tarjeteroApi.removePerson(id); onToast("Persona eliminada", true); onChanged(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="abtn abtn-del flex items-center gap-1"><ArrowLeft size={11} /> Rubros</button>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Personal — {group.name}</h2>
        </div>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nueva persona
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar persona" : "Nueva persona"}
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
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin personal en este rubro.</p>
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
