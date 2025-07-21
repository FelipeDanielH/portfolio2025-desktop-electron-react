import React, { useState, useRef, useCallback } from 'react';

interface DraggableItem {
  id?: string;
  _id?: string; // Compatibilidad con nuestro esquema
  orden?: number;
  [key: string]: any;
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, isDragging: boolean) => React.ReactNode;
  className?: string;
  scrollable?: boolean;
  maxHeight?: string;
}

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  renderItem,
  className = '',
  scrollable = false,
  maxHeight = '400px'
}: DraggableListProps<T>) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: T) => {
    const itemId = item.id || item._id;
    if (!itemId) return; // No permitir arrastrar elementos sin ID
    
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
    
    // Agregar clase de opacidad al elemento arrastrado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItem(null);
    
    // Restaurar opacidad
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItem: T) => {
    e.preventDefault();
    
    const draggedId = draggedItem?.id || draggedItem?._id;
    const targetId = targetItem.id || targetItem._id;
    
    console.log('🔄 DRAG DROP DEBUG:');
    console.log('  - Dragged ID:', draggedId);
    console.log('  - Target ID:', targetId);
    console.log('  - Dragged Item:', draggedItem);
    console.log('  - Target Item:', targetItem);
    
    if (!draggedItem || !draggedId || !targetId || draggedId === targetId) {
      console.log('❌ DRAG DROP: Invalid drop conditions');
      setDragOverItem(null);
      return;
    }

    // Reordenar items
    const draggedIndex = items.findIndex(item => (item.id || item._id) === draggedId);
    const targetIndex = items.findIndex(item => (item.id || item._id) === targetId);
    
    console.log('  - Dragged Index:', draggedIndex);
    console.log('  - Target Index:', targetIndex);
    console.log('  - Original Items:', items);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      console.log('❌ DRAG DROP: Index not found');
      return;
    }

    const newItems = [...items];
    
    // INTERCAMBIO CORRECTO: Remover elemento arrastrado e insertar en nueva posición
    const [removed] = newItems.splice(draggedIndex, 1);
    
    // Insertar en la nueva posición (esto desplaza automáticamente los demás)
    newItems.splice(targetIndex, 0, removed);

    console.log('  - New Items (before orden):', newItems);

    // Actualizar órdenes secuencialmente (1, 2, 3, etc.)
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      orden: index + 1
    }));
    
    console.log('  - Reordered Items:', reorderedItems);
    
    onReorder(reorderedItems);
    setDragOverItem(null);
  }, [draggedItem, items, onReorder]);

  return (
    <div 
      className={`space-y-2 ${className} ${scrollable ? 'overflow-y-auto' : ''}`}
      style={scrollable ? { maxHeight } : undefined}
    >
      {items.map((item, index) => {
        const itemId = item.id || item._id;
        const draggedId = draggedItem?.id || draggedItem?._id;
        
        return (
          <div
            key={itemId || `item-${index}`}
            ref={dragRef}
            draggable={!!itemId}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => itemId && handleDragOver(e, itemId)}
            onDrop={(e) => handleDrop(e, item)}
            className={`
              transition-all duration-200 ease-in-out
              ${draggedId === itemId ? 'opacity-50 scale-95' : ''}
              ${dragOverItem === itemId ? 'border-2 border-blue-400 bg-blue-50' : ''}
              ${draggedItem && draggedId !== itemId && itemId ? 'cursor-grab' : ''}
            `}
          >
            {renderItem(item, draggedId === itemId)}
          </div>
        );
      })}
    </div>
  );
} 