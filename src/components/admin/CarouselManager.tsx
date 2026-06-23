"use client";

// Issue #5: gestión del carrusel de enlaces externos desde el admin.
// Implementación base — pendiente de mejora visual por el equipo de front.

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { carouselApi } from "@/src/lib/api";
import type { CarouselItem, CarouselPip } from "@/src/types";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY = { label: "", content: "", linkUrl: "", imageUrl: "", pip: "red", order: 0, active: true };

const PIP_OPTIONS = [
  { value: "red", label: "Rojo" },
  { value: "brown", label: "Marrón" },
  { value: "dim", label: "Tenue" },
];

export default function CarouselManager({ onToast }: Props) {
  const [list, setList]           = useState<CarouselItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState({ ...EMPTY });
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    try { setList(await carouselApi.getAll()); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY }); setShowForm(true); };

  const openEdit = (c: CarouselItem) => {
    setEditingId(c.id);
    setForm({
      label: c.label,
      content: c.content ?? "",
      linkUrl: c.linkUrl ?? "",
      imageUrl: c.imageUrl ?? "",
      pip: c.pip ?? "red",
      order: c.order,
      active: c.active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      label: form.label,
      content: form.content || undefined,
      linkUrl: form.linkUrl || undefined,
      imageUrl: form.imageUrl || undefined,
      pip: form.pip as CarouselPip,
      order: +form.order,
      active: form.active,
    };
    try {
      if (editingId) { await carouselApi.update(editingId, data); onToast("Item actualizado", true); }
      else { await carouselApi.create(data); onToast("Item creado", true); }
      setShowForm(false);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("¿Eliminar este item?")) return;
    try { await carouselApi.remove(id); onToast("Item eliminado", true); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Carrusel</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar item" : "Nuevo item"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Etiqueta *</label>
              <input required value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} className="glass-input" placeholder="Dólar" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Contenido / Valor</label>
              <input value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="glass-input" placeholder="$1.200" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Link</label>
              <input value={form.linkUrl} onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))} className="glass-input" placeholder="https://..." />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Imagen (URL)</label>
              <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className="glass-input" placeholder="https://..." />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Orden</label>
              <input type="number" min={0} value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: +e.target.value }))} className="glass-input" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Color</label>
              <select value={form.pip} onChange={(e) => setForm((p) => ({ ...p, pip: e.target.value }))} className="glass-input">
                {PIP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input id="carousel-active" type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
              <label htmlFor="carousel-active" className="text-[10px] text-brand-cream/50">Activo</label>
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
          ) : list.length === 0 ? (
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin items.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Orden</th><th>Etiqueta</th><th>Contenido</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td className="text-[11px]">{c.order}</td>
                    <td className="font-medium text-brand-cream/70">{c.label}</td>
                    <td className="text-[11px] max-w-[200px] truncate">{c.content ?? "—"}</td>
                    <td>
                      <span className={`abadge ${c.active ? "abadge-brown" : "abadge-gray"}`}>
                        {c.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(c)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => deleteItem(c.id)} className="abtn abtn-del">Eliminar</button>
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
