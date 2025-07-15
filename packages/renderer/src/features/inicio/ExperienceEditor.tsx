import { useState } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";
import TagInput from "../../components/ui/TagInput";
import FormSection from "../../components/ui/FormSection";

interface Experiencia {
  rol: string;
  empresa: string;
  periodo: string;
  descripcion: string;
  tecnologias: string[];
}

export default function ExperienceEditor() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [nuevaTecnologia, setNuevaTecnologia] = useState("");
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  const agregarExperiencia = () => {
    setExperiencias([
      ...experiencias,
      { rol: "", empresa: "", periodo: "", descripcion: "", tecnologias: [] },
    ]);
  };

  const actualizarCampo = (
    index: number,
    campo: keyof Experiencia,
    valor: string
  ) => {
    const copia = [...experiencias];
    (copia[index][campo] as string) = valor;
    setExperiencias(copia);
  };
  
  const eliminarTecnologia = (index: number, tech: string) => {
    const copia = [...experiencias];
    copia[index].tecnologias = copia[index].tecnologias.filter((t) => t !== tech);
    setExperiencias(copia);
  };

  const eliminarExperiencia = (index: number) => {
    setExperiencias(experiencias.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <button
        onClick={agregarExperiencia}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Agregar experiencia
      </button>

      {experiencias.map((exp, idx) => (
        <FormSection
          key={idx}
          title={`Experiencia #${idx + 1}`}
          onDelete={() => eliminarExperiencia(idx)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Rol"
              value={exp.rol}
              onChange={(e) => actualizarCampo(idx, "rol", e.target.value)}
            />
            <InputField
              label="Empresa"
              value={exp.empresa}
              onChange={(e) => actualizarCampo(idx, "empresa", e.target.value)}
            />
            <InputField
              label="Periodo"
              placeholder="Ej: 2021 - 2023"
              value={exp.periodo}
              onChange={(e) => actualizarCampo(idx, "periodo", e.target.value)}
            />
          </div>

          <TextareaField
            label="Descripción"
            value={exp.descripcion}
            onChange={(e) => actualizarCampo(idx, "descripcion", e.target.value)}
            placeholder="Descripción de tareas, logros, etc."
            rows={3}
          />

          <TagInput
            tags={exp.tecnologias}
            onAdd={(tag) => {
              const copia = [...experiencias];
              copia[idx].tecnologias.push(tag);
              setExperiencias(copia);
            }}
            onRemove={(tag) => eliminarTecnologia(idx, tag)}
            inputValue={editandoIndex === idx ? nuevaTecnologia : ""}
            setInputValue={(val) => {
              setEditandoIndex(idx);
              setNuevaTecnologia(val);
            }}
            placeholder="Ej: React, MongoDB"
          />
        </FormSection>
      ))}
    </div>
  );
}
