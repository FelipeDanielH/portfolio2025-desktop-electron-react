import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DraggableList } from '../../components/ui/DraggableList';
import { CategoriaCard } from '../../components/ui/CategoriaCard';
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import type { Categoria } from '../../types/skills.types';

export default function CategoriesEditor() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardandoOrden, setGuardandoOrden] = useState(false);
  const [hayCambiosPendientes, setHayCambiosPendientes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: ''
  });

  // Obtener el siguiente orden disponible
  const obtenerSiguienteOrden = useCallback(() => {
    if (categorias.length === 0) return 1;
    const maxOrden = Math.max(...categorias.map(c => c.orden));
    return maxOrden + 1;
  }, [categorias]);

  // Ordenar categorías por campo orden
  const categoriasOrdenadas = useMemo(() => {
    return [...categorias].sort((a, b) => a.orden - b.orden);
  }, [categorias]);

  const cargarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await window.electronAPI.categories.getOrdered();
      if (response) {
        setCategorias(response);
        setHayCambiosPendientes(false); // Resetear cambios al cargar
      }
    } catch (error) {
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar el orden visual (sin tocar BD)
  const actualizarOrdenVisual = useCallback((nuevasCategorias: Categoria[]) => {
    // ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE
    setCategorias(nuevasCategorias);
    setHayCambiosPendientes(true); // Marcar que hay cambios pendientes
  }, []);

  // Función para guardar cambios en la BD
  const guardarCambios = useCallback(async () => {
    setGuardandoOrden(true);
    try {
      // Actualizar cada categoría con su nuevo orden SECUENCIALMENTE
      for (const categoria of categorias) {
        if (categoria._id) {
          await window.electronAPI.categories.update(categoria._id, { 
            nombre: categoria.nombre,
            orden: categoria.orden
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
  }, [categorias]);

  const crearCategoria = useCallback(async (data: { nombre: string }) => {
    try {
      const nuevaCategoria = await window.electronAPI.categories.create({
        ...data,
        orden: obtenerSiguienteOrden()
      });
      if (nuevaCategoria) {
        setCategorias(prev => [...prev, nuevaCategoria]);
      }
      setMostrarModal(false);
      setFormData({ nombre: '' });
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al crear categoría:', error);
      setError('Error al crear la categoría');
    }
  }, [obtenerSiguienteOrden]);

  const actualizarCategoria = useCallback(async (id: string, data: Partial<Categoria>) => {
    try {
      // Validar que el id existe
      if (!id) {
        console.error('❌ RENDERER: Error - ID de la categoría es undefined');
        setError('Error: La categoría no tiene un ID válido para actualizar');
        return;
      }
      
      const categoriaActualizada = await window.electronAPI.categories.update(id, data);
      if (categoriaActualizada) {
        setCategorias(prev => 
          prev.map(categoria => categoria._id === id ? categoriaActualizada : categoria)
        );
      }
      setEditandoCategoria(null);
      setMostrarModal(false);
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al actualizar categoría:', error);
      setError('Error al actualizar la categoría');
    }
  }, []);

  const eliminarCategoria = useCallback(async (id: string) => {
    try {
      if (!id) {
        setError('Error: La categoría no tiene un ID válido para eliminar');
        return;
      }

      await window.electronAPI.categories.delete(id);
      setCategorias(prev => prev.filter(categoria => categoria._id !== id));
      setError(null);
    } catch (error) {
      console.error('❌ RENDERER: Error al eliminar categoría:', error);
      setError('Error al eliminar la categoría');
    }
  }, []);

  const abrirModalEdicion = useCallback((categoria: Categoria) => {
    setEditandoCategoria(categoria);
    setFormData({
      nombre: categoria.nombre
    });
    setMostrarModal(true);
    setError(null);
  }, []);

  const abrirModalCreacion = useCallback(() => {
    setEditandoCategoria(null);
    setFormData({
      nombre: ''
    });
    setMostrarModal(true);
    setError(null);
  }, []);

  const cerrarModal = useCallback(() => {
    setMostrarModal(false);
    setEditandoCategoria(null);
    setFormData({ nombre: '' });
    setError(null);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (editandoCategoria) {
      actualizarCategoria(editandoCategoria._id!, formData);
    } else {
      crearCategoria(formData);
    }
  }, [formData, editandoCategoria, actualizarCategoria, crearCategoria]);

  // Renderizar cada categoría
  const renderCategoria = useCallback((categoria: Categoria, isDragging: boolean) => (
    <CategoriaCard
      categoria={categoria}
      isDragging={isDragging}
      onEdit={abrirModalEdicion}
      onDelete={eliminarCategoria}
    />
  ), [abrirModalEdicion, eliminarCategoria]);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner text="Cargando categorías..." />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Sección Categorías */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Gestionar Categorías</h3>
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
              ➕ Agregar Categoría
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
            <strong>💡 Tip:</strong> Arrastra y suelta las categorías para reordenarlas. 
            Los cambios se aplicarán visualmente inmediatamente. 
            {hayCambiosPendientes && (
              <span className="font-semibold text-green-700"> Haz clic en "Guardar Cambios" para persistir en la base de datos.</span>
            )}
          </p>
        </div>



        {categoriasOrdenadas.length > 0 ? (
          <DraggableList
            items={categoriasOrdenadas}
            onReorder={actualizarOrdenVisual}
            renderItem={renderCategoria}
            className="space-y-3"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay categorías creadas aún.</p>
            <p className="text-sm mt-1">Haz clic en "Agregar Categoría" para crear la primera.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editandoCategoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Frontend, Backend, etc."
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
          <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  {editandoCategoria ? 'Actualizar' : 'Crear'}
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
} 