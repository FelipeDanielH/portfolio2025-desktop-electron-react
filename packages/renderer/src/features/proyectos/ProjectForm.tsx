import { useState } from "react";
import type { Project, Tech } from "../../types/projects.types";
import { useTechs } from "../hooks/useTechs";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import TagInput from "../../components/ui/TagInput";

interface Props {
  mode: "crear" | "editar";
  initialData?: Project;
  onSubmit: (data: Omit<Project, '_id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const estados = ["en desarrollo", "completado", "abandonado"] as const;

// Mapeo correcto de campos de proyecto a tipos de tecnología
const campoToTipo: Record<string, Tech["tipo"]> = {
  tecnologias: "framework", // Las tecnologías principales son frameworks
  frameworks: "framework",
  lenguajes: "lenguaje", 
  roles: "rol",
  herramientas: "herramienta"
};

export default function ProjectForm({ mode, initialData, onSubmit, onCancel, loading }: Props) {
  const { techs, loading: techsLoading, error: techsError, clearMessages: clearTechsMessages } = useTechs();
  
  const [proyecto, setProyecto] = useState<Project>(initialData || {
    nombre: "",
    descripcion: "",
    tecnologias: [],
    roles: [],
    frameworks: [],
    lenguajes: [],
    herramientas: [],
    estado: "en desarrollo",
    año: new Date().getFullYear(),
    imagen: "",
    links: {}
  });
  const [imgPreview, setImgPreview] = useState<string>("");
  const [nuevoOtro, setNuevoOtro] = useState<{ titulo: string; url: string }>({ titulo: "", url: "" });

  // Handlers para arrays
  const updateArray = (key: keyof Project, value: string[]) => {
    setProyecto(p => ({ ...p, [key]: value }));
  };

  const addToArray = (key: keyof Project, value: string) => {
    if (!value || (proyecto[key] as string[] || []).includes(value)) return;
    setProyecto(p => ({ ...p, [key]: [...(p[key] as string[] || []), value] }));
  };
  
  const removeFromArray = (key: keyof Project, idx: number) => {
    setProyecto(p => ({ 
      ...p, 
      [key]: (p[key] as string[] || []).filter((_, i) => i !== idx) 
    }));
  };

  // Handlers para links.otros
  const addOtroLink = () => {
    if (!nuevoOtro.titulo || !nuevoOtro.url) return;
    setProyecto(p => ({ ...p, links: { ...p.links, otros: [...(p.links.otros || []), { ...nuevoOtro }] } }));
    setNuevoOtro({ titulo: "", url: "" });
  };
  const removeOtroLink = (idx: number) => setProyecto(p => ({ ...p, links: { ...p.links, otros: (p.links.otros || []).filter((_, i) => i !== idx) } }));

  // Imagen URL
  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProyecto(p => ({ ...p, imagen: url }));
    setImgPreview(url);
  };

  // Validación mínima
  const isValid = proyecto.nombre && proyecto.descripcion && proyecto.tecnologias.length > 0 && proyecto.año;

  // Techs por tipo
  const techsPorTipo = (tipo: Tech["tipo"]) => techs.filter(t => t.tipo === tipo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    try {
      await onSubmit(proyecto);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const isLoading = loading || techsLoading;
  const error = techsError;

  if (isLoading) {
    return <LoadingSpinner text="Cargando tecnologías..." />;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold">{mode === "crear" ? "Agregar proyecto" : "Editar proyecto"}</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearTechsMessages}
        />
      )}
      
      <input 
        className="border p-2 rounded-md w-full" 
        placeholder="Nombre del proyecto*" 
        value={proyecto.nombre} 
        onChange={e => setProyecto({ ...proyecto, nombre: e.target.value })} 
      />
      
      <textarea 
        className="border p-2 rounded-md w-full" 
        placeholder="Descripción*" 
        value={proyecto.descripcion} 
        onChange={e => setProyecto({ ...proyecto, descripcion: e.target.value })} 
        rows={3} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TagInput solo para tecnologías principales */}
        <div className="md:col-span-2">
          <TagInput
            label="Tecnologías principales*"
            value={proyecto.tecnologias || []}
            onChange={(tags) => updateArray('tecnologias', tags)}
            suggestions={techsPorTipo('framework').map(t => t.nombre)}
            placeholder="Escribir tecnología y presionar Enter..."
            maxTags={8}
          />
        </div>
        
        {/* Dropdowns para los demás campos */}
        {(["frameworks", "lenguajes", "roles", "herramientas"] as const).map(tipo => (
          <div key={tipo}>
            <label className="block font-medium text-sm mb-1">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</label>
            <select 
              className="border p-2 rounded-md w-full" 
              onChange={e => addToArray(tipo, e.target.value)} 
              value=""
            >
              <option value="">Agregar {tipo.slice(0, -1)}</option>
              {techsPorTipo(campoToTipo[tipo]).map(t => (
                <option key={t._id} value={t.nombre}>{t.nombre}</option>
              ))}
            </select>
            <ul className="flex flex-wrap gap-2 mt-2">
              {(proyecto[tipo] as string[] || []).map((v, i) => (
                <li key={i} className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
                  {v}
                  <button 
                    className="text-red-500 ml-1" 
                    onClick={e => { e.preventDefault(); removeFromArray(tipo, i); }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div>
          <label className="block font-medium text-sm mb-1">Estado</label>
          <select 
            className="border p-2 rounded-md w-full" 
            value={proyecto.estado} 
            onChange={e => setProyecto({ ...proyecto, estado: e.target.value as Project["estado"] })}
          >
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block font-medium text-sm mb-1">Año</label>
          <input 
            className="border p-2 rounded-md w-full" 
            type="number" 
            min={2000} 
            max={2100} 
            value={proyecto.año} 
            onChange={e => setProyecto({ ...proyecto, año: Number(e.target.value) })} 
          />
        </div>
        
        <div>
          <label className="block font-medium text-sm mb-1">URL de la imagen</label>
          <input 
            className="border p-2 rounded-md w-full" 
            type="url" 
            placeholder="https://ejemplo.com/imagen.jpg"
            value={proyecto.imagen || ""} 
            onChange={handleImgChange} 
          />
          {imgPreview && <img src={imgPreview} alt="preview" className="mt-2 max-w-xs rounded-md" />}
        </div>
      </div>
      
      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          className="border p-2 rounded-md w-full" 
          placeholder="Demo" 
          value={proyecto.links.demo || ""} 
          onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, demo: e.target.value } })} 
        />
        <input 
          className="border p-2 rounded-md w-full" 
          placeholder="Frontend" 
          value={proyecto.links.frontend || ""} 
          onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, frontend: e.target.value } })} 
        />
        <input 
          className="border p-2 rounded-md w-full" 
          placeholder="Backend" 
          value={proyecto.links.backend || ""} 
          onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, backend: e.target.value } })} 
        />
        <input 
          className="border p-2 rounded-md w-full" 
          placeholder="GitHub" 
          value={proyecto.links.github || ""} 
          onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, github: e.target.value } })} 
        />
      </div>
      
      {/* Otros links */}
      <div>
        <label className="block font-medium text-sm mb-1">Otros links</label>
        {(proyecto.links.otros || []).map((o, i) => (
          <div key={i} className="flex gap-2 items-center mt-1">
            <input 
              className="border p-2 rounded-md flex-1" 
              placeholder="Título" 
              value={o.titulo} 
              onChange={e => setProyecto(p => ({ ...p, links: { ...p.links, otros: (p.links.otros || []).map((x, j) => j === i ? { ...x, titulo: e.target.value } : x) } }))} 
            />
            <input 
              className="border p-2 rounded-md flex-1" 
              placeholder="URL" 
              value={o.url} 
              onChange={e => setProyecto(p => ({ ...p, links: { ...p.links, otros: (p.links.otros || []).map((x, j) => j === i ? { ...x, url: e.target.value } : x) } }))} 
            />
            <button type="button" className="text-red-500" onClick={() => removeOtroLink(i)}>Eliminar</button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input 
            className="border p-2 rounded-md flex-1" 
            placeholder="Título" 
            value={nuevoOtro.titulo} 
            onChange={e => setNuevoOtro(o => ({ ...o, titulo: e.target.value }))} 
          />
          <input 
            className="border p-2 rounded-md flex-1" 
            placeholder="URL" 
            value={nuevoOtro.url} 
            onChange={e => setNuevoOtro(o => ({ ...o, url: e.target.value }))} 
          />
          <button type="button" className="bg-indigo-600 text-white px-3 rounded-md" onClick={addOtroLink}>Agregar</button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400" 
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Guardando..." : (mode === "crear" ? "Guardar proyecto" : "Guardar cambios")}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
} 