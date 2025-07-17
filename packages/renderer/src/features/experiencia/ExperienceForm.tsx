import { useState } from "react";

interface Experience {
  _id?: string;
  rol: string;
  empresa: string;
  ubicacion: string;
  modalidad?: "Remoto" | "Presencial" | "Híbrido";
  equipo?: string;
  sector?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion: string;
  responsabilidades?: string[];
  logros?: string[];
  tecnologias?: string[];
  orden: number;
}

interface Props {
  mode: "crear" | "editar";
  initialData?: Experience;
}

export default function ExperienceForm({ mode, initialData }: Props) {
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
    orden: 1,
  });

  // Handlers para arrays
  const addToArray = (key: keyof Experience) => setExp(e => ({ ...e, [key]: [...(e[key] as string[]), ""] }));
  const updateArray = (key: keyof Experience, idx: number, value: string) => setExp(e => ({ ...e, [key]: (e[key] as string[]).map((v, i) => i === idx ? value : v) }));
  const removeFromArray = (key: keyof Experience, idx: number) => setExp(e => ({ ...e, [key]: (e[key] as string[]).filter((_, i) => i !== idx) }));

  // Validación mínima
  const isValid = exp.rol && exp.empresa && exp.ubicacion && exp.fecha_inicio && exp.descripcion;

  return (
    <form className="space-y-6">
      <h2 className="text-xl font-bold">{mode === "crear" ? "Agregar experiencia" : "Editar experiencia"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded-md" placeholder="Rol*" value={exp.rol} onChange={e => setExp({ ...exp, rol: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Empresa*" value={exp.empresa} onChange={e => setExp({ ...exp, empresa: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Ubicación*" value={exp.ubicacion} onChange={e => setExp({ ...exp, ubicacion: e.target.value })} />
        <select className="border p-2 rounded-md" value={exp.modalidad || ""} onChange={e => setExp({ ...exp, modalidad: e.target.value as any })}>
          <option value="">Modalidad</option>
          <option value="Remoto">Remoto</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
        </select>
        <input className="border p-2 rounded-md" placeholder="Sector" value={exp.sector || ""} onChange={e => setExp({ ...exp, sector: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Equipo" value={exp.equipo || ""} onChange={e => setExp({ ...exp, equipo: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Fecha inicio* (YYYY-MM)" value={exp.fecha_inicio} onChange={e => setExp({ ...exp, fecha_inicio: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Fecha fin (YYYY-MM o vacío si vigente)" value={exp.fecha_fin || ""} onChange={e => setExp({ ...exp, fecha_fin: e.target.value })} />
        <input className="border p-2 rounded-md" placeholder="Orden" type="number" min={1} value={exp.orden} onChange={e => setExp({ ...exp, orden: Number(e.target.value) })} />
      </div>
      <textarea className="border p-2 rounded-md w-full" placeholder="Descripción*" value={exp.descripcion} onChange={e => setExp({ ...exp, descripcion: e.target.value })} rows={3} />
      {/* Arrays dinámicos */}
      <div>
        <label className="font-medium text-sm">Responsabilidades</label>
        {(exp.responsabilidades || []).map((r, i) => (
          <div key={i} className="flex gap-2 mt-1">
            <input className="border p-2 rounded-md flex-1" value={r} onChange={e => updateArray("responsabilidades", i, e.target.value)} placeholder="Responsabilidad" />
            <button type="button" onClick={() => removeFromArray("responsabilidades", i)} className="text-red-500">Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={() => addToArray("responsabilidades") } className="text-indigo-600 text-sm mt-1">+ Agregar responsabilidad</button>
      </div>
      <div>
        <label className="font-medium text-sm">Logros</label>
        {(exp.logros || []).map((l, i) => (
          <div key={i} className="flex gap-2 mt-1">
            <input className="border p-2 rounded-md flex-1" value={l} onChange={e => updateArray("logros", i, e.target.value)} placeholder="Logro" />
            <button type="button" onClick={() => removeFromArray("logros", i)} className="text-red-500">Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={() => addToArray("logros") } className="text-indigo-600 text-sm mt-1">+ Agregar logro</button>
      </div>
      <div>
        <label className="font-medium text-sm">Tecnologías</label>
        {(exp.tecnologias || []).map((t, i) => (
          <div key={i} className="flex gap-2 mt-1">
            <input className="border p-2 rounded-md flex-1" value={t} onChange={e => updateArray("tecnologias", i, e.target.value)} placeholder="Tecnología" />
            <button type="button" onClick={() => removeFromArray("tecnologias", i)} className="text-red-500">Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={() => addToArray("tecnologias") } className="text-indigo-600 text-sm mt-1">+ Agregar tecnología</button>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700" disabled={!isValid}>
        {mode === "crear" ? "Guardar experiencia" : "Guardar cambios"}
      </button>
    </form>
  );
} 