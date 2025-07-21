import type { Experience } from '../../types/experience.types';

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  const getStatusBadge = () => {
    if (!experience.fecha_fin) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Actualidad
        </span>
      );
    }
    return null;
  };

  const getModalidadBadge = () => {
    if (!experience.modalidad) return null;
    
    const colors = {
      'Remoto': 'bg-blue-100 text-blue-800',
      'Presencial': 'bg-purple-100 text-purple-800',
      'Híbrido': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[experience.modalidad]}`}>
        {experience.modalidad}
      </span>
    );
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{experience.rol}</h3>
            {getStatusBadge()}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {experience.empresa} • {experience.ubicacion}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {formatDate(experience.fecha_inicio)} - {experience.fecha_fin ? formatDate(experience.fecha_fin) : 'Actualidad'}
          </div>
          {experience.sector && (
            <div className="text-xs text-gray-500 mb-2">
              Sector: {experience.sector}
            </div>
          )}
          {getModalidadBadge()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(experience._id!)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(experience._id!)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {experience.descripcion}
        </p>
        
        {experience.responsabilidades && experience.responsabilidades.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Responsabilidades
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {experience.responsabilidades.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {experience.logros && experience.logros.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Logros
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {experience.logros.map((logro, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {logro}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {experience.tecnologias && experience.tecnologias.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Tecnologías
            </h4>
            <div className="flex flex-wrap gap-1">
              {experience.tecnologias.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 