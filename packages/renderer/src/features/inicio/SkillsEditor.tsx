import { useState } from "react";
import InputField from "../../components/ui/InputField";

interface Concepto {
  nombre: string;
  aprendido: boolean;
  _id: string;
}

interface Skill {
  id?: string;
  categoria: string;
  tecnologia: string;
  nivel: string;
  puntuacion: number;
  descripcion: string;
  conceptos: Concepto[];
  ordenTecnologia?: number;
}

const niveles = ["Básico", "Intermedio", "Avanzado", "Experto"];

// Simulación de categorías (esto luego vendrá de CategoriesEditor o un hook global)
const categoriasDemo = [
  { id: '1', nombre: 'Frontend' },
  { id: '2', nombre: 'Backend' },
  { id: '3', nombre: 'Lenguajes' },
];

export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editando, setEditando] = useState<number | null>(null);

  // CRUD de skills
  const agregarSkill = () => {
    setSkills((prev) => ([
      ...prev,
      {
        categoria: "",
        tecnologia: "",
        nivel: "Básico",
        puntuacion: 1,
        descripcion: "",
        conceptos: [],
        ordenTecnologia: 1,
      },
    ]));
    setEditando(skills.length);
  };

  const eliminarSkill = (idx: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== idx));
    if (editando === idx) setEditando(null);
  };

  const actualizarCampo = <K extends keyof Skill>(idx: number, campo: K, valor: Skill[K]) => {
    setSkills((prev) => {
      const copia = prev.map((s, i) => i === idx ? { ...s, [campo]: valor } : s);
      return copia;
    });
  };

  // CRUD de conceptos
  const agregarConcepto = (idx: number) => {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setSkills((prev) => {
      console.log('Agregando concepto a skill', idx, 'id generado:', uniqueId);
      return prev.map((s, i) =>
        i === idx
          ? { ...s, conceptos: [...s.conceptos, { nombre: "", aprendido: false, _id: uniqueId }] }
          : s
      );
    });
  };

  const actualizarConcepto = (idx: number, cidx: number, campo: keyof Concepto, valor: any) => {
    setSkills((prev) => {
      return prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              conceptos: s.conceptos.map((c, j) =>
                j === cidx ? { ...c, [campo]: valor } : c
              ),
            }
          : s
      );
    });
  };

  const eliminarConcepto = (idx: number, cidx: number) => {
    setSkills((prev) => {
      console.log('Eliminando concepto', cidx, 'de skill', idx);
      return prev.map((s, i) =>
        i === idx
          ? { ...s, conceptos: s.conceptos.filter((_, j) => j !== cidx) }
          : s
      );
    });
  };

  // Ordenar skills para visualización
  const skillsOrdenadas = [...skills].sort((a, b) => {
    return (a.ordenTecnologia ?? 0) - (b.ordenTecnologia ?? 0);
  });

  return (
    <div className="space-y-6">
      <button
        onClick={agregarSkill}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Agregar tecnología
      </button>

      {skillsOrdenadas.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay tecnologías registradas.
        </div>
      )}

      {skillsOrdenadas.map((skill, idx) => (
        <div key={idx} className="border p-4 rounded-md bg-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              {skill.tecnologia || <span className="italic text-gray-400">Nueva tecnología</span>}
            </h3>
            <button
              onClick={() => eliminarSkill(idx)}
              className="text-red-500 hover:underline text-sm"
            >
              Eliminar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-sm mb-1">Categoría</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={skill.categoria}
                onChange={e => actualizarCampo(idx, "categoria", e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {categoriasDemo.map(cat => (
                  <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <InputField
              label="Tecnología"
              value={skill.tecnologia}
              onChange={e => actualizarCampo(idx, "tecnologia", e.target.value)}
              placeholder="Ej: React"
            />
            <div>
              <label className="block font-medium text-sm mb-1">Nivel</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={skill.nivel}
                onChange={e => actualizarCampo(idx, "nivel", e.target.value)}
              >
                {niveles.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>
            <InputField
              label="Puntuación (1-10)"
              type="number"
              min={1}
              max={10}
              value={skill.puntuacion}
              onChange={e => actualizarCampo(idx, "puntuacion", Number(e.target.value))}
            />
            <InputField
              label="Orden de tecnología"
              type="number"
              min={1}
              value={skill.ordenTecnologia ?? 1}
              onChange={e => actualizarCampo(idx, "ordenTecnologia", Number(e.target.value))}
            />
          </div>

          {/* Conceptos asociados */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Conceptos asociados</span>
              <button
                onClick={() => agregarConcepto(idx)}
                className="text-indigo-600 text-sm hover:underline"
              >
                + Agregar concepto
              </button>
            </div>
            {skill.conceptos.length === 0 && (
              <div className="text-gray-400 text-sm">No hay conceptos.</div>
            )}
            {skill.conceptos.map((concepto, cidx) => (
              <div key={concepto._id} className="flex gap-2 items-center">
                <InputField
                  label=""
                  placeholder="Nombre del concepto"
                  value={concepto.nombre}
                  onChange={e => actualizarConcepto(idx, cidx, "nombre", e.target.value)}
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={concepto.aprendido}
                    onChange={e => actualizarConcepto(idx, cidx, "aprendido", e.target.checked)}
                  />
                  Aprendido
                </label>
                <button
                  type="button"
                  onClick={() => eliminarConcepto(idx, cidx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
