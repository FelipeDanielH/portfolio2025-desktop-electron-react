import { useState } from "react";
import InputField from "../../components/ui/InputField";

interface GrupoHabilidad {
  categoria: string;
  habilidades: string[];
}

export default function SkillsEditor() {
  const [grupos, setGrupos] = useState<GrupoHabilidad[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevaHabilidad, setNuevaHabilidad] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null);

  const agregarCategoria = () => {
    if (!nuevaCategoria.trim()) return;
    setGrupos([...grupos, { categoria: nuevaCategoria.trim(), habilidades: [] }]);
    setNuevaCategoria("");
  };

  const agregarHabilidad = () => {
    if (grupoSeleccionado === null || !nuevaHabilidad.trim()) return;
    const copia = [...grupos];
    copia[grupoSeleccionado].habilidades.push(nuevaHabilidad.trim());
    setGrupos(copia);
    setNuevaHabilidad("");
  };

  const eliminarGrupo = (index: number) => {
    setGrupos(grupos.filter((_, i) => i !== index));
    if (grupoSeleccionado === index) setGrupoSeleccionado(null);
  };

  const eliminarHabilidad = (grupoIdx: number, habilidad: string) => {
    const copia = [...grupos];
    copia[grupoIdx].habilidades = copia[grupoIdx].habilidades.filter((h) => h !== habilidad);
    setGrupos(copia);
  };

  return (
    <div className="space-y-6">
      {/* Nueva categoría */}
      <div className="flex gap-2">
        <div className="flex-1">
          <InputField
            label=""
            placeholder="Nueva categoría (ej: Frontend)"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
          />
        </div>
        <button
          onClick={agregarCategoria}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Agregar categoría
        </button>
      </div>

      {/* Lista de categorías */}
      {grupos.map((grupo, idx) => (
        <div key={idx} className="border p-4 rounded-md space-y-2 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{grupo.categoria}</h3>
            <button
              onClick={() => eliminarGrupo(idx)}
              className="text-red-500 hover:underline text-sm"
            >
              Eliminar grupo
            </button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <InputField
                label=""
                placeholder="Agregar habilidad"
                value={grupoSeleccionado === idx ? nuevaHabilidad : ""}
                onChange={(e) => {
                  setGrupoSeleccionado(idx);
                  setNuevaHabilidad(e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") agregarHabilidad();
                }}
              />
            </div>
            <button
              onClick={agregarHabilidad}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Agregar
            </button>
          </div>

          <ul className="flex flex-wrap gap-2 mt-2">
            {grupo.habilidades.map((h, i) => (
              <li
                key={i}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {h}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => eliminarHabilidad(idx, h)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
