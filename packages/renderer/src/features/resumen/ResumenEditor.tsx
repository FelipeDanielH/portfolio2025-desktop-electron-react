import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DraggableList } from '../../components/ui/DraggableList';
import { AboutBlockCard } from '../../components/ui/AboutBlockCard';

interface AboutBlock {
  id?: string;
  titulo: string;
  descripcion: string;
  orden: number;
}

interface ResumenEditorProps {
  // ... existing props
}

export const ResumenEditor: React.FC<ResumenEditorProps> = () => {
  const [bloquesAbout, setBloquesAbout] = useState<AboutBlock[]>([]);
  const [editandoBloque, setEditandoBloque] = useState<AboutBlock | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardandoOrden, setGuardandoOrden] = useState(false);
  const [hayCambiosPendientes, setHayCambiosPendientes] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: ''
  });

  // Obtener el siguiente orden disponible
  const obtenerSiguienteOrden = useCallback(() => {
    if (bloquesAbout.length === 0) return 1;
    const maxOrden = Math.max(...bloquesAbout.map(b => b.orden));
    return maxOrden + 1;
  }, [bloquesAbout]);

  // Ordenar bloques por campo orden
  const bloquesOrdenados = useMemo(() => {
    return [...bloquesAbout].sort((a, b) => a.orden - b.orden);
  }, [bloquesAbout]);

  const cargarBloquesAbout = useCallback(async () => {
    try {
      const response = await window.electronAPI.about.getAll();
      if (response) {
        // Verificar que todos los bloques tengan ID
        const bloquesSinId = response.filter(bloque => !bloque.id);
        
        if (bloquesSinId.length > 0) {
          console.warn('⚠️ RENDERER: Bloques sin ID encontrados:', bloquesSinId);
        }
        
        setBloquesAbout(response);
        setHayCambiosPendientes(false); // Resetear cambios al cargar
      }
    } catch (error) {
      console.error('Error al cargar bloques About:', error);
    }
  }, []);

  // Función para actualizar el orden visual (sin tocar BD)
  const actualizarOrdenVisual = useCallback((nuevosBloques: AboutBlock[]) => {
    // ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE
    setBloquesAbout(nuevosBloques);
    setHayCambiosPendientes(true); // Marcar que hay cambios pendientes
  }, [bloquesAbout]);

  // Función para guardar cambios en la BD
  const guardarCambios = useCallback(async () => {
    setGuardandoOrden(true);
    try {
      // Actualizar cada bloque con su nuevo orden SECUENCIALMENTE
      for (const bloque of bloquesAbout) {
        if (bloque.id) {
          await window.electronAPI.about.update(bloque.id, { 
            titulo: bloque.titulo,
            descripcion: bloque.descripcion,
            orden: bloque.orden
          });
        }
      }
      
      setHayCambiosPendientes(false);
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al guardar cambios:', error);
      setError('Error al guardar los cambios en la base de datos');
    } finally {
      setGuardandoOrden(false);
    }
  }, [bloquesAbout]);

  const crearBloqueAbout = useCallback(async (data: { titulo: string; descripcion: string }) => {
    try {
      const nuevoBloque = await window.electronAPI.about.create({
        ...data,
        orden: obtenerSiguienteOrden()
      });
      if (nuevoBloque) {
        setBloquesAbout(prev => [...prev, nuevoBloque]);
      }
      setMostrarModal(false);
      setFormData({ titulo: '', descripcion: '' });
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al crear bloque About:', error);
      setError('Error al crear el bloque');
    }
  }, [obtenerSiguienteOrden]);

  const actualizarBloqueAbout = useCallback(async (id: string, data: Partial<AboutBlock>) => {
    try {
      // Validar que el id existe
      if (!id) {
        console.error('❌ RENDERER: Error - ID del bloque es undefined');
        setError('Error: El bloque no tiene un ID válido para actualizar');
        return;
      }
      
      const bloqueActualizado = await window.electronAPI.about.update(id, data);
      if (bloqueActualizado) {
        setBloquesAbout(prev => 
          prev.map(bloque => bloque.id === id ? bloqueActualizado : bloque)
        );
      }
      setEditandoBloque(null);
      setMostrarModal(false);
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al actualizar bloque About:', error);
      setError('Error al actualizar el bloque');
    }
  }, []);

  const eliminarBloqueAbout = useCallback(async (id: string) => {
    try {
      if (!id) {
        setError('Error: El bloque no tiene un ID válido para eliminar');
        return;
      }

      await window.electronAPI.about.delete(id);
      setBloquesAbout(prev => prev.filter(bloque => bloque.id !== id));
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al eliminar bloque About:', error);
      setError('Error al eliminar el bloque');
    }
  }, []);

  const abrirModalEdicion = useCallback((bloque: AboutBlock) => {
    setEditandoBloque(bloque);
    setFormData({
      titulo: bloque.titulo,
      descripcion: bloque.descripcion
    });
    setMostrarModal(true);
    setError(null);
  }, []);

  const abrirModalCreacion = useCallback(() => {
    setEditandoBloque(null);
    setFormData({
      titulo: '',
      descripcion: ''
    });
    setMostrarModal(true);
    setError(null);
  }, []);

  const cerrarModal = useCallback(() => {
    setMostrarModal(false);
    setEditandoBloque(null);
    setFormData({ titulo: '', descripcion: '' });
    setError(null);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (editandoBloque) {
      actualizarBloqueAbout(editandoBloque.id!, formData);
    } else {
      crearBloqueAbout(formData);
    }
  }, [formData, editandoBloque, actualizarBloqueAbout, crearBloqueAbout]);

  // Renderizar cada bloque About
  const renderAboutBlock = useCallback((bloque: AboutBlock, isDragging: boolean) => (
    <AboutBlockCard
      bloque={bloque}
      isDragging={isDragging}
      onEdit={abrirModalEdicion}
      onDelete={eliminarBloqueAbout}
    />
  ), [abrirModalEdicion, eliminarBloqueAbout]);

  useEffect(() => {
    cargarBloquesAbout();
  }, [cargarBloquesAbout]);

  return (
    <div className="p-6">
      {/* Sección About */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Bloques About</h3>
          <div className="flex items-center gap-3">
            {hayCambiosPendientes && (
              <button
                onClick={guardarCambios}
                disabled={guardandoOrden}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                {guardandoOrden ? (
                  <>
                    <span className="animate-spin">💾</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    💾 Guardar Cambios
                  </>
                )}
              </button>
            )}
            <button
              onClick={abrirModalCreacion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              ➕ Agregar Bloque
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Arrastra y suelta los bloques para reordenarlos. 
            Los cambios se aplicarán visualmente inmediatamente. 
            {hayCambiosPendientes && (
              <span className="font-semibold text-green-700"> Haz clic en "Guardar Cambios" para persistir en la base de datos.</span>
            )}
          </p>
        </div>

        {bloquesOrdenados.length > 0 ? (
          <DraggableList
            items={bloquesOrdenados}
            onReorder={actualizarOrdenVisual}
            renderItem={renderAboutBlock}
            className="space-y-3"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay bloques About creados aún.</p>
            <p className="text-sm mt-1">Haz clic en "Agregar Bloque" para crear el primero.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editandoBloque ? 'Editar Bloque' : 'Crear Nuevo Bloque'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Pasión por la tecnología"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe tu pasión, experiencia, etc."
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  {editandoBloque ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};