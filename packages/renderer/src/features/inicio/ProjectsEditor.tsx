import { useState } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";
import TagInput from "../../components/ui/TagInput";
import FormSection from "../../components/ui/FormSection";

interface Proyecto {
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  links: {
    frontend?: string;
    backend?: string;
    demo?: string;
    github?: string;
    otros?: { titulo: string; url: string }[];
  };
}

export default function ProjectsEditor() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [nuevaTecnologia, setNuevaTecnologia] = useState("");
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

  const agregarProyecto = () => {
    setProyectos(prev => [
      ...prev,
      {
        nombre: "",
        descripcion: "",
        tecnologias: [],
        links: { otros: [] }
      }
    ]);
  };

  const eliminarProyecto = (index: number) => {
    setProyectos(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarCampo = (index: number, campo: keyof Proyecto, valor: string) => {
    setProyectos(prev => {
      const copia = [...prev];
      (copia[index][campo] as any) = valor;
      return copia;
    });
  };

  const actualizarLink = (index: number, linkName: keyof Proyecto["links"], valor: string) => {
    setProyectos(prev => {
      const copia = [...prev];
      copia[index].links = { ...copia[index].links, [linkName]: valor };
      return copia;
    });
  };

  const eliminarTecnologia = (index: number, tech: string) => {
    setProyectos(prev => {
      const copia = [...prev];
      copia[index].tecnologias = copia[index].tecnologias.filter(t => t !== tech);
      return copia;
    });
  };

  const actualizarOtroLink = (
  idxProyecto: number,
  idxLink: number,
  campo: "titulo" | "url",
  valor: string
) => {
  setProyectos(prev => {
    return prev.map((proyecto, i) => {
      if (i !== idxProyecto) return proyecto;

      const nuevosOtros = (proyecto.links.otros ?? []).map((link, j) =>
        j === idxLink ? { ...link, [campo]: valor } : link
      );

      return {
        ...proyecto,
        links: {
          ...proyecto.links,
          otros: nuevosOtros
        }
      };
    });
  });
};

const agregarOtroLink = (idxProyecto: number) => {
  setProyectos(prev => {
    return prev.map((proyecto, i) => {
      if (i !== idxProyecto) return proyecto;

      const nuevosOtros = [...(proyecto.links.otros ?? []), { titulo: "", url: "" }];

      return {
        ...proyecto,
        links: {
          ...proyecto.links,
          otros: nuevosOtros
        }
      };
    });
  });
};

const eliminarOtroLink = (idxProyecto: number, idxLink: number) => {
  setProyectos(prev => {
    return prev.map((proyecto, i) => {
      if (i !== idxProyecto) return proyecto;

      const nuevosOtros = (proyecto.links.otros ?? []).filter((_, j) => j !== idxLink);

      return {
        ...proyecto,
        links: {
          ...proyecto.links,
          otros: nuevosOtros
        }
      };
    });
  });
};


  return (
    <div className="space-y-6">
      <button
        onClick={agregarProyecto}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Agregar proyecto
      </button>

      {proyectos.map((proyecto, idx) => (
        <FormSection
          key={idx}
          title={`Proyecto #${idx + 1}`}
          onDelete={() => eliminarProyecto(idx)}
        >
          <InputField
            label="Nombre del proyecto"
            value={proyecto.nombre}
            onChange={(e) => actualizarCampo(idx, "nombre", e.target.value)}
          />

          <TextareaField
            label="Descripción"
            value={proyecto.descripcion}
            onChange={(e) => actualizarCampo(idx, "descripcion", e.target.value)}
            placeholder="Breve resumen del proyecto"
            rows={3}
          />

          <TagInput
            tags={proyecto.tecnologias}
            onAdd={(tag) => {
              const copia = [...proyectos];
              copia[idx].tecnologias.push(tag);
              setProyectos(copia);
            }}
            onRemove={(tag) => eliminarTecnologia(idx, tag)}
            inputValue={editandoIndex === idx ? nuevaTecnologia : ""}
            setInputValue={(val) => {
              setEditandoIndex(idx);
              setNuevaTecnologia(val);
            }}
            placeholder="Ej: React, MongoDB, Tailwind"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["frontend", "backend", "demo", "github"] as const).map((key) => (
              <InputField
                key={key}
                label={`Link ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                value={proyecto.links[key] ?? ""}
                onChange={(e) => actualizarLink(idx, key, e.target.value)}
                placeholder={`https://${key}.com`}
              />
            ))}
          </div>

          {/* Otros links personalizados */}
          <div className="mt-6 space-y-2">
            <label className="block font-medium text-sm">Otros links personalizados</label>

            {(proyecto.links.otros ?? []).map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <InputField
                  label=""
                  placeholder="Título"
                  value={link.titulo}
                  onChange={(e) => actualizarOtroLink(idx, i, "titulo", e.target.value)}
                />
                <InputField
                  label=""
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => actualizarOtroLink(idx, i, "url", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => eliminarOtroLink(idx, i)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => agregarOtroLink(idx)}
              className="text-indigo-600 text-sm hover:underline"
            >
              + Agregar otro link
            </button>
          </div>

        </FormSection>
      ))}
    </div>
  );
}
