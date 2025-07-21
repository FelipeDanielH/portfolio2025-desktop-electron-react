import { useExperience } from '../hooks/useExperience';
import FormSection from '../../components/ui/FormSection';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';
import type { Experience } from '../../types/experience.types';

interface ExperienceListProps {
  onEdit: (experience: Experience) => void;
}

export function ExperienceList({ onEdit }: ExperienceListProps) {
  const { 
    experiences, 
    loading, 
    error, 
    successMessage, 
    delete: deleteExperience, 
    clearMessages
  } = useExperience();

  const handleEdit = (experience: Experience) => {
    onEdit(experience);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      await deleteExperience(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando experiencia...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Experiencia profesional</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearMessages}
        />
      )}
      
      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onDismiss={clearMessages}
        />
      )}
      
      {experiences.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">No hay experiencias registradas.</div>
      ) : (
        experiences.map(exp => (
          <FormSection key={exp._id} title={exp.rol}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Empresa:</span> {exp.empresa}<br/>
                <span className="font-semibold">Ubicación:</span> {exp.ubicacion}<br/>
                {exp.modalidad && <><span className="font-semibold">Modalidad:</span> {exp.modalidad}<br/></>}
                {exp.sector && <><span className="font-semibold">Sector:</span> {exp.sector}<br/></>}
                <span className="font-semibold">Fechas:</span> {exp.fecha_inicio} - {exp.fecha_fin || "Actualidad"}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(exp)} 
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(exp._id!)} 
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {exp.descripcion && <div className="mb-2 text-gray-600">{exp.descripcion}</div>}
            {exp.responsabilidades && exp.responsabilidades.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Responsabilidades:</span>
                <ul className="list-disc list-inside ml-4">
                  {exp.responsabilidades.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {exp.logros && exp.logros.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Logros:</span>
                <ul className="list-disc list-inside ml-4">
                  {exp.logros.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </div>
            )}
            {exp.tecnologias && exp.tecnologias.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Tecnologías:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exp.tecnologias.map((tech, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </FormSection>
        ))
      )}
    </div>
  );
} 