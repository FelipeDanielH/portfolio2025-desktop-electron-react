import { useEducation } from '../hooks/useEducation';
import FormSection from '../../components/ui/FormSection';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';
import type { Education } from '../../types/education.types';

interface EducationListProps {
  onEdit: (education: Education) => void;
}

const tipoLabel = (tipo: string) => {
  return tipo === 'formacion' ? '🎓 ' : '🏆 ';
};

export function EducationList({ onEdit }: EducationListProps) {
  const { 
    educations, 
    loading, 
    error, 
    successMessage, 
    delete: deleteEducation, 
    clearMessages
  } = useEducation();

  const handleEdit = (education: Education) => {
    onEdit(education);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta educación?')) {
      await deleteEducation(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando educación...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Formación académica y certificaciones</h2>
      
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
      
      {educations.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">No hay formaciones registradas.</div>
      ) : (
        educations.map(edu => (
          <FormSection key={edu._id} title={<>{tipoLabel(edu.tipo)}{edu.titulo}</>}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Institución:</span> {edu.institucion}<br/>
                <span className="font-semibold">Estado:</span> {edu.estado}<br/>
                <span className="font-semibold">Fechas:</span> {edu.fecha_inicio} - {edu.estado === "En curso" ? "Actualidad" : edu.fecha_fin}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(edu)} 
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(edu._id!)} 
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {edu.descripcion && <div className="mb-2 text-gray-600">{edu.descripcion}</div>}
            {edu.aprendizajes && edu.aprendizajes.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Aprendizajes clave:</span>
                <ul className="list-disc list-inside ml-4">
                  {edu.aprendizajes.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
            {edu.links_relevantes && edu.links_relevantes.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Links relevantes:</span>
                <ul className="list-disc list-inside ml-4">
                  {edu.links_relevantes.map((l, i) => (
                    <li key={i}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{l.titulo}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {edu.certificado_url && (
              <div className="mt-2">
                <a href={edu.certificado_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver certificado</a>
                <div className="mt-2">
                  <img src={edu.certificado_url} alt="Certificado" className="max-h-48 rounded-md border" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>
            )}
          </FormSection>
        ))
      )}
    </div>
  );
} 