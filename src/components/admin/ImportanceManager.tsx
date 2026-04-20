"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { importanceApi } from "@/src/lib/api";
import type { ImportanceLevel } from "@/src/types";

interface Props {
  onToast: (msg: string, ok: boolean) => void;
}

const EMPTY = { level: 1, label: "", description: "", notifySubscribers: false };

export default function ImportanceManager({ onToast }: Props) {
  const [list, setList]         = useState<ImportanceLevel[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try { setList(await importanceApi.getAll()); }
    catch (err) { onToast((err as Error).message, false); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditingId(null); setForm({ ...EMPTY }); setShowForm(true);
  };

  const openEdit = (l: ImportanceLevel) => {
    setEditingId(l.id);
    setForm({ level: l.level, label: l.label, description: l.description ?? "", notifySubscribers: l.notifySubscribers });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { level: +form.level, label: form.label, description: form.description || undefined, notifySubscribers: form.notifySubscribers };
    try {
      if (editingId) {
        await importanceApi.update(editingId, data);
        onToast("Nivel actualizado", true);
      } else {
        await importanceApi.create(data);
        onToast("Nivel creado", true);
      }
      setShowForm(false);
      load();
    } catch (err) {
      onToast((err as Error).message, false);
    } finally {
      setSaving(false);
    }
  };

  const toggleNotify = async (id: number) => {
    try { await importanceApi.toggleNotify(id); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  const deleteLevel = async (id: number) => {
    if (!confirm("¿Eliminar este nivel?")) return;
    try { await importanceApi.remove(id); onToast("Nivel eliminado", true); load(); }
    catch (err) { onToast((err as Error).message, false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-brand-cream/40 uppercase">Niveles de Importancia</h2>
        <button onClick={openCreate} className="abtn abtn-edit flex items-center gap-1">
          <Plus size={11} /> Nuevo
        </button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold tracking-[0.15em] text-brand-cream/60 uppercase">
              {editingId ? "Editar nivel" : "Nuevo nivel"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-brand-cream/30 hover:text-brand-cream"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Nivel (número) *</label>
              <input type="number" required min={1} value={form.level}
                onChange={(e) => setForm((p) => ({ ...p, level: +e.target.value }))}
                className="glass-input" />
            </div>
            <div>
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Etiqueta *</label>
              <input required value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                className="glass-input" placeholder="Urgente" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[8px] font-bold tracking-[0.18em] uppercase text-brand-cream/30 block mb-1">Descripción</label>
              <input value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="glass-input" placeholder="Descripción del nivel" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="imp-notify"
                checked={form.notifySubscribers}
                onChange={(e) => setForm((p) => ({ ...p, notifySubscribers: e.target.checked }))}
                className="w-4 h-4 accent-[#7A4A2A]"
              />
              <label htmlFor="imp-notify" className="text-[11px] text-brand-cream/50 cursor-pointer">
                Notificar suscriptores al publicar con este nivel
              </label>
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
            <p className="text-center py-8 text-[11px] text-brand-cream/30">Sin niveles creados.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Nivel</th><th>Etiqueta</th><th>Descripción</th><th>Notificar</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {list.map((l) => (
                  <tr key={l.id}>
                    <td><span className="font-bold text-brand-cream/80">{l.level}</span></td>
                    <td className="font-medium text-brand-cream/70">{l.label}</td>
                    <td className="text-[11px] max-w-[200px] truncate">{l.description ?? "—"}</td>
                    <td>
                      <button
                        onClick={() => toggleNotify(l.id)}
                        className={`abtn abtn-notify ${l.notifySubscribers ? "active" : ""}`}
                      >
                        {l.notifySubscribers ? "🔔 Activo" : "🔕 Inactivo"}
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(l)} className="abtn abtn-edit">Editar</button>
                        <button onClick={() => deleteLevel(l.id)} className="abtn abtn-del">Eliminar</button>
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
