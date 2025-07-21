import { useState } from "react";
import type { Project } from "../../types/projects.types";
import { useProjects } from "../hooks/useProjects";
import { useTechs } from "../hooks/useTechs";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

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
  const { projects, loading: projectsLoading, error: projectsError, delete: deleteProject, clearMessages: clearProjectsMessages } = useProjects();
  const { techs, loading: techsLoading, error: techsError, clearMessages: clearTechsMessages } = useTechs();
  
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>("lenguaje");
  const [valorFiltro, setValorFiltro] = useState("");

  const techsPorTipo = techs.filter(t => t.tipo === tipoFiltro);

  const proyectosFiltrados = valorFiltro
    ? projects.filter(p => Array.isArray(p[filtroKeyMap[tipoFiltro]]) && (p[filtroKeyMap[tipoFiltro]] as string[]).includes(valorFiltro))
    : projects;

  const handleDeleteProject = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      await deleteProject(id);
    }
  };

  const loading = projectsLoading || techsLoading;
  const error = projectsError || techsError;

  const clearError = () => {
    if (projectsError) clearProjectsMessages();
    if (techsError) clearTechsMessages();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Listado de proyectos</h2>
        <LoadingSpinner text="Cargando proyectos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Listado de proyectos</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
        />
      )}

      <div className="flex gap-2 mb-4">
        <select className="border p-2 rounded-md" value={tipoFiltro} onChange={e => { setTipoFiltro(e.target.value as TipoFiltro); setValorFiltro(""); }}>
          {tiposFiltro.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select className="border p-2 rounded-md" value={valorFiltro} onChange={e => setValorFiltro(e.target.value)}>
          <option value="">Todos</option>
          {techsPorTipo.map(t => <option key={t._id} value={t.nombre}>{t.nombre}</option>)}
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
                  <button 
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => handleDeleteProject(p._id!)}
                  >
                    Eliminar
                  </button>
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