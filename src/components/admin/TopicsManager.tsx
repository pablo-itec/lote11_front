"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { topicsApi } from "@/src/lib/api";
import type { Topic } from "@/src/types";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY = { name: "", description: "", type: "separate" as "separate" | "grouped", priority: 1 };

export default function TopicsManager({ onToast }: Props) {
  const [list, setList]         = useState<Topic[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try { setList(await topicsApi.getAll()); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null); setForm({ ...EMPTY }); setShowForm(true);
  };

  const openEdit = (t: Topic) => {
    setEditingId(t.id);
    setForm({ name: t.name, description: t.description ?? "", type: t.type, priority: t.priority });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { name: form.name, description: form.description || undefined, type: form.type, priority: +form.priority };
    try {
      if (editingId) {
        await topicsApi.update(editingId, data);
        onToast("Tema actualizado", true);
      } else {
        await topicsApi.create(data);
        onToast("Tema creado", true);
      }
      setShowForm(false);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const deleteTopic = async (id: number) => {
    if (!confirm("¿Eliminar este tema?")) return;
    try { await topicsApi.remove(id); onToast("Tema eliminado", true); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  const f = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Temas</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar tema" : "Nuevo tema"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Nombre *</label>
              <input required value={form.name} onChange={f("name")} className="glass-input" placeholder="Real Estate" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Descripción</label>
              <input value={form.description} onChange={f("description")} className="glass-input" placeholder="Descripción breve" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Tipo</label>
              <select value={form.type} onChange={f("type")} className="glass-input">
                <option value="separate">Separado</option>
                <option value="grouped">Agrupado</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Prioridad</label>
              <input type="number" min={1} value={form.priority} onChange={f("priority")} className="glass-input" />
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
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin temas.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Nombre</th><th>Tipo</th><th>Descripción</th><th>Prioridad</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id}>
                    <td className="font-medium text-brand-cream/70">{t.name}</td>
                    <td>
                      <span className={`abadge ${t.type === "grouped" ? "abadge-brown" : "abadge-gray"}`}>
                        {t.type === "grouped" ? "Agrupado" : "Separado"}
                      </span>
                    </td>
                    <td className="text-[11px] max-w-[200px] truncate">{t.description ?? "—"}</td>
                    <td className="text-[11px]">{t.priority}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(t)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => deleteTopic(t.id)} className="abtn abtn-del">Eliminar</button>
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
