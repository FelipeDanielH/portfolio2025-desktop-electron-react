import { useState } from "react";

interface Project {
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  roles?: string[];
  frameworks?: string[];
  lenguajes?: string[];
  herramientas?: string[];
  estado: "en desarrollo" | "completado" | "abandonado";
  año: number;
  imagen?: string;
  links: {
    demo?: string;
    frontend?: string;
    backend?: string;
    github?: string;
    otros?: { titulo: string; url: string }[];
  };
}

interface Tech {
  _id: string;
  tipo: "lenguaje" | "framework" | "rol" | "herramienta";
  nombre: string;
  icono?: string;
}

interface Props {
  mode: "crear" | "editar";
  initialData?: Project;
}

const mockTechs: Tech[] = [
  { _id: "1", tipo: "framework", nombre: "React" },
  { _id: "2", tipo: "framework", nombre: "Vue" },
  { _id: "3", tipo: "lenguaje", nombre: "JavaScript" },
  { _id: "4", tipo: "lenguaje", nombre: "TypeScript" },
  { _id: "5", tipo: "rol", nombre: "Frontend" },
  { _id: "6", tipo: "herramienta", nombre: "Docker" }
];

const estados = ["en desarrollo", "completado", "abandonado"] as const;

export default function ProjectForm({ mode, initialData }: Props) {
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
  const addToArray = (key: keyof Project, value: string) => {
    if (!value || (proyecto[key] as string[]).includes(value)) return;
    setProyecto(p => ({ ...p, [key]: [...(p[key] as string[]), value] }));
  };
  const removeFromArray = (key: keyof Project, idx: number) => setProyecto(p => ({ ...p, [key]: (p[key] as string[]).filter((_, i) => i !== idx) }));

  // Handlers para links.otros
  const addOtroLink = () => {
    if (!nuevoOtro.titulo || !nuevoOtro.url) return;
    setProyecto(p => ({ ...p, links: { ...p.links, otros: [...(p.links.otros || []), { ...nuevoOtro }] } }));
    setNuevoOtro({ titulo: "", url: "" });
  };
  const removeOtroLink = (idx: number) => setProyecto(p => ({ ...p, links: { ...p.links, otros: (p.links.otros || []).filter((_, i) => i !== idx) } }));

  // Imagen preview
  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImgPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
      setProyecto(p => ({ ...p, imagen: file.name })); // Solo nombre, en real sería la URL
    }
  };

  // Validación mínima
  const isValid = proyecto.nombre && proyecto.descripcion && proyecto.tecnologias.length > 0 && proyecto.año;

  // Techs por tipo
  const techsPorTipo = (tipo: Tech["tipo"]) => mockTechs.filter(t => t.tipo === tipo);

  return (
    <form className="space-y-6">
      <h2 className="text-xl font-bold">{mode === "crear" ? "Agregar proyecto" : "Editar proyecto"}</h2>
      <input className="border p-2 rounded-md w-full" placeholder="Nombre del proyecto*" value={proyecto.nombre} onChange={e => setProyecto({ ...proyecto, nombre: e.target.value })} />
      <textarea className="border p-2 rounded-md w-full" placeholder="Descripción*" value={proyecto.descripcion} onChange={e => setProyecto({ ...proyecto, descripcion: e.target.value })} rows={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Autocompletado múltiple para techs */}
        {(["tecnologias", "frameworks", "lenguajes", "roles", "herramientas"] as const).map(tipo => (
          <div key={tipo}>
            <label className="block font-medium text-sm mb-1">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</label>
            <select className="border p-2 rounded-md w-full" onChange={e => addToArray(tipo, e.target.value)} value="">
              <option value="">Agregar {tipo.slice(0, -1)}</option>
              {techsPorTipo(tipo === "tecnologias" ? "framework" : tipo as Tech["tipo"]).map(t => <option key={t._id} value={t.nombre}>{t.nombre}</option>)}
            </select>
            <ul className="flex flex-wrap gap-2 mt-2">
              {(proyecto[tipo] as string[]).map((v, i) => (
                <li key={i} className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
                  {v}
                  <button className="text-red-500 ml-1" onClick={e => { e.preventDefault(); removeFromArray(tipo, i); }}>&times;</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <label className="block font-medium text-sm mb-1">Estado</label>
          <select className="border p-2 rounded-md w-full" value={proyecto.estado} onChange={e => setProyecto({ ...proyecto, estado: e.target.value as Project["estado"] })}>
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Año</label>
          <input className="border p-2 rounded-md w-full" type="number" min={2000} max={2100} value={proyecto.año} onChange={e => setProyecto({ ...proyecto, año: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Imagen</label>
          <input className="border p-2 rounded-md w-full" type="file" accept="image/*" onChange={handleImgChange} />
          {imgPreview && <img src={imgPreview} alt="preview" className="mt-2 max-w-xs rounded-md" />}
        </div>
      </div>
      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded-md w-full" placeholder="Demo" value={proyecto.links.demo || ""} onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, demo: e.target.value } })} />
        <input className="border p-2 rounded-md w-full" placeholder="Frontend" value={proyecto.links.frontend || ""} onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, frontend: e.target.value } })} />
        <input className="border p-2 rounded-md w-full" placeholder="Backend" value={proyecto.links.backend || ""} onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, backend: e.target.value } })} />
        <input className="border p-2 rounded-md w-full" placeholder="GitHub" value={proyecto.links.github || ""} onChange={e => setProyecto({ ...proyecto, links: { ...proyecto.links, github: e.target.value } })} />
      </div>
      {/* Otros links */}
      <div>
        <label className="block font-medium text-sm mb-1">Otros links</label>
        {(proyecto.links.otros || []).map((o, i) => (
          <div key={i} className="flex gap-2 items-center mt-1">
            <input className="border p-2 rounded-md flex-1" placeholder="Título" value={o.titulo} onChange={e => setProyecto(p => ({ ...p, links: { ...p.links, otros: (p.links.otros || []).map((x, j) => j === i ? { ...x, titulo: e.target.value } : x) } }))} />
            <input className="border p-2 rounded-md flex-1" placeholder="URL" value={o.url} onChange={e => setProyecto(p => ({ ...p, links: { ...p.links, otros: (p.links.otros || []).map((x, j) => j === i ? { ...x, url: e.target.value } : x) } }))} />
            <button type="button" className="text-red-500" onClick={() => removeOtroLink(i)}>Eliminar</button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input className="border p-2 rounded-md flex-1" placeholder="Título" value={nuevoOtro.titulo} onChange={e => setNuevoOtro(o => ({ ...o, titulo: e.target.value }))} />
          <input className="border p-2 rounded-md flex-1" placeholder="URL" value={nuevoOtro.url} onChange={e => setNuevoOtro(o => ({ ...o, url: e.target.value }))} />
          <button type="button" className="bg-indigo-600 text-white px-3 rounded-md" onClick={addOtroLink}>Agregar</button>
        </div>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700" disabled={!isValid}>
        {mode === "crear" ? "Guardar proyecto" : "Guardar cambios"}
      </button>
    </form>
  );
} 