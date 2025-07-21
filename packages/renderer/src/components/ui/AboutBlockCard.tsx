interface AboutBlock {
  id?: string;
  titulo: string;
  descripcion: string;
  orden: number;
}

interface AboutBlockCardProps {
  bloque: AboutBlock;
  isDragging?: boolean;
  onEdit: (bloque: AboutBlock) => void;
  onDelete: (id: string) => void;
}

export function AboutBlockCard({
  bloque,
  isDragging = false,
  onEdit,
  onDelete
}: AboutBlockCardProps) {
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
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex-shrink-0">
              Orden: {bloque.orden}
            </span>
            <h4 className="font-semibold text-gray-900 truncate">{bloque.titulo}</h4>
          </div>
          <p 
            className="text-gray-600 text-sm leading-relaxed line-clamp-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {bloque.descripcion}
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <button
            onClick={() => onEdit(bloque)}
            disabled={!bloque.id}
            className={`text-sm font-medium px-3 py-1 rounded ${
              bloque.id 
                ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title={!bloque.id ? 'Este bloque no se puede editar (sin ID)' : 'Editar bloque'}
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => bloque.id && onDelete(bloque.id)}
            disabled={!bloque.id}
            className={`text-sm font-medium px-3 py-1 rounded ${
              bloque.id 
                ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title={!bloque.id ? 'Este bloque no se puede eliminar (sin ID)' : 'Eliminar bloque'}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
} 