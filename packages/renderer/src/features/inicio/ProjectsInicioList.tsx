import { useEffect, useMemo, useState } from 'react';
import { useHomeProjects } from '../hooks/useHomeProjects';
import { useProjects } from '../hooks/useProjects';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';

function isMongoObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function ProjectsInicioList() {
  // Hooks para datos
  const { homeProjects, loading: loadingHome, error: errorHome, update } = useHomeProjects();
  const { projects, loading: loadingProjects, error: errorProjects } = useProjects();

  // Estado local para destacados
  const [selected, setSelected] = useState<string[]>(homeProjects?.projects || []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Normalizar IDs tras cargar del backend
  useEffect(() => {
    if (homeProjects) {
      const ids = Array.isArray(homeProjects.projects)
        ? homeProjects.projects.map((item: any) =>
            typeof item === 'string' ? item : item._id
          )
        : [];
      setSelected(ids);
    }
  }, [homeProjects]);

  // Diccionario de proyectos por ID
  const projectsById = useMemo(() => {
    const dict: Record<string, any> = {};
    for (const project of projects || []) {
      if (project && project._id) dict[String(project._id)] = project;
    }
    return dict;
  }, [projects]);

  // IDs destacados inválidos
  const idsInvalidos = selected.filter(id => !id || !isMongoObjectId(id) || !projectsById[String(id)]);

  // Proyectos disponibles para añadir (no están en destacados)
  const disponibles = useMemo(() => {
    return (projects || []).filter(
      project => project && project._id && !selected.includes(String(project._id))
    );
  }, [projects, selected]);

  // Proyectos destacados (ordenados)
  const destacados = useMemo(() => {
    return selected
      .map(id => projectsById[String(id)])
      .filter(Boolean);
  }, [selected, projectsById]);

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ projects: selected });
      setSuccessMessage('Proyectos destacados actualizados');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (e) {
      // El error ya se maneja por el hook
    } finally {
      setSaving(false);
    }
  };

  // Añadir proyecto a destacados
  const handleAdd = (id: string) => {
    if (!selected.includes(id)) setSelected([...selected, id]);
  };

  // Quitar proyecto de destacados
  const handleRemove = (id: string) => {
    setSelected(selected.filter(pid => pid !== id));
  };

  if (loadingHome || loadingProjects) {
    return <LoadingSpinner text="Cargando proyectos..." />;
  }

  // Card visual para un proyecto
  function ProjectCard({ project, action, actionLabel, actionColor }: any) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col h-full">
        {project.imagen && (
          <img src={project.imagen} alt={project.nombre} className="rounded-t-lg object-cover h-32 w-full" />
        )}
        <div className="flex-1 flex flex-col p-3">
          <div className="font-semibold text-base text-gray-800 mb-1">{project.nombre}</div>
          <div className="text-xs text-gray-500 mb-2 line-clamp-2">{project.descripcion}</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {(project.tecnologias || []).map((tech: string) => (
              <span key={tech} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{tech}</span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mb-2">{project.estado} &middot; {project.año}</div>
          <div className="mt-auto flex justify-end">
            <button
              onClick={action}
              className={`text-xs font-semibold border rounded px-2 py-1 transition ${actionColor}`}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Botón de guardar y mensaje de éxito, centrados y separados */}
      <div className="flex flex-col items-center gap-2 mb-2">
        {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 shadow font-semibold"
          disabled={saving}
        >
          Guardar cambios
        </button>
      </div>
      {/* Grid de proyectos destacados */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold mb-2">Proyectos en inicio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {idsInvalidos.length > 0 && (
            <div className="col-span-full mb-2 text-yellow-700 text-xs px-3 pt-2">
              <span className="font-semibold">IDs inválidos en destacados:</span>
              <ul className="list-disc ml-5">
                {idsInvalidos.map(id => (
                  <li key={String(id)} className="italic">
                    [{typeof id === 'string' ? id : JSON.stringify(id)}]
                    <button onClick={() => handleRemove(String(id))} className="text-red-600 hover:underline ml-2">Quitar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {destacados.length === 0 && idsInvalidos.length === 0 ? (
            <div className="col-span-full text-gray-500 px-3 py-2">No hay proyectos destacados.</div>
          ) : (
            destacados.map((project: any) => (
              <ProjectCard
                key={typeof project?._id === 'string' ? project._id : JSON.stringify(project?._id)}
                project={project}
                action={() => handleRemove(String(project?._id))}
                actionLabel="Quitar de inicio"
                actionColor="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
              />
            ))
          )}
        </div>
      </div>
      {/* Grid de todos los proyectos */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold mb-2">Todos los proyectos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {disponibles.length === 0 && (
            <div className="col-span-full text-xs text-gray-400 px-6 py-2 italic border-b border-gray-200 text-center">No hay proyectos para mostrar.</div>
          )}
          {disponibles.map((project: any) => (
            <ProjectCard
              key={typeof project?._id === 'string' ? project._id : JSON.stringify(project?._id)}
              project={project}
              action={() => handleAdd(String(project?._id))}
              actionLabel="Añadir a inicio"
              actionColor="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 disabled:opacity-40"
            />
          ))}
        </div>
        {errorHome && <ErrorMessage message={errorHome} onDismiss={() => {}} />}
        {errorProjects && <ErrorMessage message={errorProjects} onDismiss={() => {}} />}
      </div>
    </div>
  );
} 