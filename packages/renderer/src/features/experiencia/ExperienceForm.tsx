import { useState } from "react";
import type { Experience } from "../../types/experience.types";

interface Props {
  mode: "crear" | "editar";
  initialData?: Experience;
  onSubmit: (data: Omit<Experience, '_id'>) => Promise<void>;
  onCancel: () => void;
}

export default function ExperienceForm({ mode, initialData, onSubmit, onCancel }: Props) {
  const [exp, setExp] = useState<Experience>(initialData || {
    rol: "",
    empresa: "",
    ubicacion: "",
    modalidad: undefined,
    equipo: "",
    sector: "",
    fecha_inicio: "",
    fecha_fin: "",
    descripcion: "",
    responsabilidades: [],
    logros: [],
    tecnologias: [],
  });

  // Handlers para arrays
  const addToArray = (key: keyof Experience) => setExp(e => ({ ...e, [key]: [...(e[key] as string[]), ""] }));
  const updateArray = (key: keyof Experience, idx: number, value: string) => setExp(e => ({ ...e, [key]: (e[key] as string[]).map((v, i) => i === idx ? value : v) }));
  const removeFromArray = (key: keyof Experience, idx: number) => setExp(e => ({ ...e, [key]: (e[key] as string[]).filter((_, i) => i !== idx) }));

  // Validación mínima
  const isValid = exp.rol && exp.empresa && exp.ubicacion && exp.fecha_inicio && exp.descripcion;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const { _id, ...dataToSubmit } = exp;
      await onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">{mode === "crear" ? "Agregar experiencia" : "Editar experiencia"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol*</label>
          <input 
            className="border p-2 rounded-md w-full" 
            placeholder="Ej: Frontend Developer" 
            value={exp.rol} 
            onChange={e => setExp({ ...exp, rol: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa*</label>
          <input 
            className="border p-2 rounded-md w-full" 
            placeholder="Ej: Tech Solutions" 
            value={exp.empresa} 
            onChange={e => setExp({ ...exp, empresa: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación*</label>
          <input 
            className="border p-2 rounded-md w-full" 
            placeholder="Ej: Santiago, Chile" 
            value={exp.ubicacion} 
            onChange={e => setExp({ ...exp, ubicacion: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
          <select 
            className="border p-2 rounded-md w-full" 
            value={exp.modalidad || ""} 
            onChange={e => setExp({ ...exp, modalidad: e.target.value as any })}>
            <option value="">Seleccionar modalidad</option>
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
          <input 
            className="border p-2 rounded-md w-full" 
            placeholder="Ej: Tecnología, Finanzas" 
            value={exp.sector || ""} 
            onChange={e => setExp({ ...exp, sector: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
          <input 
            className="border p-2 rounded-md w-full" 
            placeholder="Ej: Frontend Team" 
            value={exp.equipo || ""} 
            onChange={e => setExp({ ...exp, equipo: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio*</label>
          <input 
            type="month"
            className="border p-2 rounded-md w-full" 
            value={exp.fecha_inicio} 
            onChange={e => setExp({ ...exp, fecha_inicio: e.target.value })} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
          <input 
            type="month"
            className="border p-2 rounded-md w-full" 
            value={exp.fecha_fin || ""} 
            onChange={e => setExp({ ...exp, fecha_fin: e.target.value })} 
          />
          <p className="text-xs text-gray-500 mt-1">Dejar vacío si es tu trabajo actual</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
        <textarea 
          className="border p-2 rounded-md w-full" 
          placeholder="Describe tus responsabilidades principales y logros en este rol..." 
          value={exp.descripcion} 
          onChange={e => setExp({ ...exp, descripcion: e.target.value })} 
          rows={4} 
        />
      </div>
      {/* Arrays dinámicos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Responsabilidades principales</label>
        {(exp.responsabilidades || []).map((r, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input 
              className="border p-2 rounded-md flex-1" 
              value={r} 
              onChange={e => updateArray("responsabilidades", i, e.target.value)} 
              placeholder="Ej: Desarrollo de interfaces con React" 
            />
            <button 
              type="button" 
              onClick={() => removeFromArray("responsabilidades", i)} 
              className="text-red-500 hover:text-red-700 px-2"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addToArray("responsabilidades")} 
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          + Agregar responsabilidad
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logros destacados</label>
        {(exp.logros || []).map((l, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input 
              className="border p-2 rounded-md flex-1" 
              value={l} 
              onChange={e => updateArray("logros", i, e.target.value)} 
              placeholder="Ej: Mejoré el rendimiento en un 40%" 
            />
            <button 
              type="button" 
              onClick={() => removeFromArray("logros", i)} 
              className="text-red-500 hover:text-red-700 px-2"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addToArray("logros")} 
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          + Agregar logro
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologías utilizadas</label>
        {(exp.tecnologias || []).map((t, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input 
              className="border p-2 rounded-md flex-1" 
              value={t} 
              onChange={e => updateArray("tecnologias", i, e.target.value)} 
              placeholder="Ej: React, TypeScript, Node.js" 
            />
            <button 
              type="button" 
              onClick={() => removeFromArray("tecnologias", i)} 
              className="text-red-500 hover:text-red-700 px-2"
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addToArray("tecnologias")} 
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          + Agregar tecnología
        </button>
      </div>
      <div className="flex gap-3 pt-4 border-t">
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={!isValid}
        >
          {mode === "crear" ? "Crear experiencia" : "Guardar cambios"}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
} 