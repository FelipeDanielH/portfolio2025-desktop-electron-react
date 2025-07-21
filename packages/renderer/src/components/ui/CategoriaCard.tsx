import type { Categoria } from '../../types/skills.types';

interface CategoriaCardProps {
  categoria: Categoria;
  isDragging?: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: string) => void;
}

export function CategoriaCard({
  categoria,
  isDragging = false,
  onEdit,
  onDelete
}: CategoriaCardProps) {
  return (
    <div
      className={`
        border border-gray-200 rounded-lg p-4 bg-white shadow-sm
        ${isDragging ? 'opacity-50 scale-95' : ''}
        transition-all duration-200 ease-in-out
        cursor-grab active:cursor-grabbing
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded flex-shrink-0">
              Orden: {categoria.orden}
            </span>
            <h4 className="font-semibold text-gray-900 truncate">{categoria.nombre}</h4>
          </div>
          <p className="text-gray-500 text-sm">
            Categoría de habilidades
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(categoria)}
            className="text-sm font-medium px-3 py-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            title="Editar categoría"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => categoria._id && onDelete(categoria._id)}
            className="text-sm font-medium px-3 py-1 rounded text-red-600 hover:text-red-800 hover:bg-red-50"
            title="Eliminar categoría"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
} 