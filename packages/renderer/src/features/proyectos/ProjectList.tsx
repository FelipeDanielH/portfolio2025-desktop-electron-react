import { useState } from "react";

interface Project {
  _id: string;
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

const mockTechs: Tech[] = [
  { _id: "1", tipo: "framework", nombre: "React" },
  { _id: "2", tipo: "framework", nombre: "Vue" },
  { _id: "3", tipo: "lenguaje", nombre: "JavaScript" },
  { _id: "4", tipo: "lenguaje", nombre: "TypeScript" },
  { _id: "5", tipo: "rol", nombre: "Frontend" },
  { _id: "6", tipo: "herramienta", nombre: "Docker" }
];

const mockProyectos: Project[] = [
  {
    _id: "1",
    nombre: "Portfolio Web",
    descripcion: "Sitio personal con Next.js y Tailwind.",
    tecnologias: ["React", "TypeScript", "Tailwind"],
    roles: ["Frontend"],
    frameworks: ["Next.js"],
    lenguajes: ["TypeScript"],
    herramientas: ["Vercel", "Tailwind"],
    estado: "completado",
    año: 2024,
    imagen: "https://miportfolio.com/img/portfolio.png",
    links: {
      demo: "https://portfolio.vercel.app",
      github: "https://github.com/miusuario/portfolio"
    }
  },
  {
    _id: "2",
    nombre: "API de Finanzas",
    descripcion: "API REST para gestión de gastos.",
    tecnologias: ["Python", "FastAPI", "Docker"],
    roles: ["Backend"],
    frameworks: ["FastAPI"],
    lenguajes: ["Python"],
    herramientas: ["Docker"],
    estado: "en desarrollo",
    año: 2023,
    imagen: "https://miportfolio.com/img/finanzas.png",
    links: {
      github: "https://github.com/miusuario/finanzas-api"
    }
  }
];

const tiposFiltro = [
  { value: "lenguaje", label: "Lenguaje" },
  { value: "framework", label: "Framework" },
  { value: "rol", label: "Rol" },
  { value: "herramienta", label: "Herramienta" }
] as const;

type TipoFiltro = typeof tiposFiltro[number]["value"];

const filtroKeyMap: Record<TipoFiltro, keyof Project> = {
  lenguaje: "lenguajes",
  framework: "frameworks",
  rol: "roles",
  herramienta: "herramientas"
};

export default function ProjectList() {
  const [proyectos, setProyectos] = useState<Project[]>(mockProyectos);
  const [techs] = useState<Tech[]>(mockTechs);
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("lenguaje");
  const [valorFiltro, setValorFiltro] = useState("");

  const techsPorTipo = techs.filter(t => t.tipo === tipoFiltro);

  const proyectosFiltrados = valorFiltro
    ? proyectos.filter(p => Array.isArray(p[filtroKeyMap[tipoFiltro]]) && (p[filtroKeyMap[tipoFiltro]] as string[]).includes(valorFiltro))
    : proyectos;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Listado de proyectos</h2>
      <div className="flex gap-2 mb-4">
        <select className="border p-2 rounded-md" value={tipoFiltro} onChange={e => { setTipoFiltro(e.target.value as TipoFiltro); setValorFiltro(""); }}>
          {tiposFiltro.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select className="border p-2 rounded-md" value={valorFiltro} onChange={e => setValorFiltro(e.target.value)}>
          <option value="">Todos</option>
          {techsPorTipo.map(t => <option key={t.nombre} value={t.nombre}>{t.nombre}</option>)}
        </select>
      </div>
      {proyectosFiltrados.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">No hay proyectos para este filtro.</div>
      ) : (
        <div className="space-y-4">
          {proyectosFiltrados.map((p) => (
            <div key={p._id} className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{p.nombre}</div>
                  <div className="text-sm text-gray-600">{p.descripcion}</div>
                  <div className="text-xs text-gray-400">{p.año} - {p.estado}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-indigo-600 hover:underline text-sm">Editar</button>
                  <button className="text-red-500 hover:underline text-sm">Eliminar</button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Tecnologías: {p.tecnologias.join(", ")}<br/>
                Lenguajes: {(p.lenguajes || []).join(", ")}<br/>
                Frameworks: {(p.frameworks || []).join(", ")}<br/>
                Roles: {(p.roles || []).join(", ")}<br/>
                Herramientas: {(p.herramientas || []).join(", ")}
              </div>
              {p.imagen && <img src={p.imagen} alt={p.nombre} className="mt-2 max-w-xs rounded-md" />}
              {p.links && (
                <div className="mt-2 text-xs">
                  {p.links.demo && <a href={p.links.demo} className="text-blue-600 underline mr-2" target="_blank">Demo</a>}
                  {p.links.github && <a href={p.links.github} className="text-blue-600 underline mr-2" target="_blank">GitHub</a>}
                  {p.links.frontend && <a href={p.links.frontend} className="text-blue-600 underline mr-2" target="_blank">Frontend</a>}
                  {p.links.backend && <a href={p.links.backend} className="text-blue-600 underline mr-2" target="_blank">Backend</a>}
                  {(p.links.otros || []).map((o, i) => <a key={i} href={o.url} className="text-blue-600 underline mr-2" target="_blank">{o.titulo}</a>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 