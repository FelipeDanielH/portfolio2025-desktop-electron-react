import type { Skill } from '../../types/skills.types';

interface SkillCardProps {
  skill: Skill;
  isDragging: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  getCategoriaName: (categoriaId: string) => string;
}

export function SkillCard({ 
  skill, 
  isDragging, 
  onEdit, 
  onDelete, 
  getCategoriaName 
}: SkillCardProps) {
  return (
    <div
      className={`
        flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm
        ${isDragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:shadow-md'}
        transition-all duration-200 cursor-move
      `}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Número de orden */}
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
          {skill.orden || 1}
        </div>

        {/* Información principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {skill.tecnologia}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              skill.nivel === 'Experto' ? 'bg-purple-100 text-purple-800' :
              skill.nivel === 'Avanzado' ? 'bg-blue-100 text-blue-800' :
              skill.nivel === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {skill.nivel}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Categoría:</span>
              <span className="font-medium">{getCategoriaName(skill.categoria_id)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Puntuación:</span>
              <div className="flex items-center gap-1">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(skill.puntuacion / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {skill.puntuacion}/10
                </span>
              </div>
            </div>

            {skill.descripcion && (
              <div className="text-gray-500 text-xs truncate">
                {skill.descripcion}
              </div>
            )}

            {skill.conceptos && skill.conceptos.length > 0 && (
              <div className="text-xs text-gray-500">
                Conceptos: {skill.conceptos.map(c => c.nombre).join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(skill);
          }}
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-md transition-colors"
          title="Editar habilidad"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`¿Seguro que deseas eliminar "${skill.tecnologia}"?`)) {
              onDelete(skill._id!);
            }
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
          title="Eliminar habilidad"
        >
          🗑️
        </button>
      </div>
    </div>
  );
} 