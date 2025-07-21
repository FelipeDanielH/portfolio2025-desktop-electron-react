import { useState, useCallback, useMemo, useEffect } from "react";
import { useSkills } from '../hooks/useSkills';
import { useCategories } from '../hooks/useCategories';
import SkillForm from '../habilidades/SkillForm';
import { DraggableList } from '../../components/ui/DraggableList';
import { SkillCard } from '../../components/ui/SkillCard';
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import SuccessMessage from "../../components/ui/SuccessMessage";
import type { Skill } from '../../types/skills.types';

export default function SkillsEditor() {
  const {
    skills,
    loading: skillsLoading,
    error: skillsError,
    createSkill,
    updateSkill,
    deleteSkill,
    loadSkills,
    clearError: clearSkillsError
  } = useSkills();

  const {
    categorias,
    loading: categoriesLoading,
    error: categoriesError,
    clearError: clearCategoriesError
  } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hayCambiosPendientes, setHayCambiosPendientes] = useState(false);
  const [guardandoOrden, setGuardandoOrden] = useState(false);
  const [skillsLocal, setSkillsLocal] = useState<Skill[]>([]);

  const handleCreateSkill = async (data: Omit<Skill, '_id'>) => {
    try {
      await createSkill(data);
      setShowForm(false);
      setSuccessMessage('Habilidad creada correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error ya manejado por el hook
    }
  };

  const handleUpdateSkill = async (data: Omit<Skill, '_id'>) => {
    try {
      if (editingSkill) {
        await updateSkill(editingSkill._id!, data);
        setEditingSkill(null);
        setShowForm(false); // Cerrar el formulario después de actualizar
        setSuccessMessage('Habilidad actualizada correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      // Error ya manejado por el hook
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar esta habilidad?")) {
      try {
        await deleteSkill(id);
        setSuccessMessage('Habilidad eliminada correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        // Error ya manejado por el hook
      }
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  // Ordenar habilidades por campo orden
  const skillsOrdenadas = useMemo(() => {
    // Usar skills locales si hay cambios pendientes, sino usar skills del hook
    const skillsToUse = hayCambiosPendientes ? skillsLocal : skills;
    
    const sorted = [...skillsToUse].sort((a, b) => (a.orden || 1) - (b.orden || 1));
    
    return sorted;
  }, [skills, skillsLocal, hayCambiosPendientes]);

  // Sincronizar skills locales con las del hook
  useEffect(() => {
    setSkillsLocal(skills);
  }, [skills]);

  // Función para actualizar el orden visual (sin tocar BD)
  const actualizarOrdenVisual = useCallback((nuevasSkills: any[]) => {
    // ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE
    setSkillsLocal(nuevasSkills);
    setHayCambiosPendientes(true);
  }, [skills]);

  // Función para guardar cambios en la BD
  const guardarCambios = useCallback(async () => {
    setGuardandoOrden(true);
    try {
      // Actualizar cada habilidad con su nuevo orden SECUENCIALMENTE
      for (const skill of skillsLocal) {
        if (skill._id) {
          await window.electronAPI.skills.update(skill._id, { 
            tecnologia: skill.tecnologia,
            categoria_id: skill.categoria_id,
            nivel: skill.nivel,
            puntuacion: skill.puntuacion,
            descripcion: skill.descripcion,
            conceptos: skill.conceptos,
            orden: skill.orden
          });
        }
      }
      
      // Recargar las habilidades para sincronizar con la BD
      await loadSkills();
      
      setHayCambiosPendientes(false);
      setSuccessMessage('Orden de habilidades guardado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('❌ Error al guardar cambios:', error);
      // El error se maneja a través del hook useSkills
      console.error('Error al guardar los cambios en la base de datos');
    } finally {
      setGuardandoOrden(false);
    }
  }, [skillsLocal, loadSkills]);

  const getCategoriaName = (categoriaId: string) => {
    const categoria = categorias.find(c => c._id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  };

  const loading = skillsLoading || categoriesLoading;
  const error = skillsError || categoriesError;

  // Renderizar cada habilidad
  const renderSkill = useCallback((skill: any, isDragging: boolean) => (
    <SkillCard
      skill={skill}
      isDragging={isDragging}
      onEdit={handleEditSkill}
      onDelete={handleDeleteSkill}
      getCategoriaName={getCategoriaName}
    />
  ), [handleEditSkill, handleDeleteSkill, getCategoriaName]);

  const clearError = () => {
    if (skillsError) clearSkillsError();
    if (categoriesError) clearCategoriesError();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Gestionar Habilidades</h2>
        <LoadingSpinner text="Cargando habilidades..." />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">

        
        <SkillForm
          skill={editingSkill}
          onSubmit={editingSkill ? handleUpdateSkill : handleCreateSkill}
          onCancel={handleCancelForm}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Gestionar Habilidades</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
        />
      )}

      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
      <button
          onClick={() => setShowForm(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
          Agregar nueva habilidad
      </button>

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
      </div>

      {skills.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No hay habilidades registradas.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Habilidades Existentes</h3>
            <div className="text-sm text-gray-500">
              {skillsOrdenadas.length} habilidades
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Arrastra y suelta las habilidades para reordenarlas. 
              Los cambios se aplicarán visualmente inmediatamente. 
              {hayCambiosPendientes && (
                <span className="font-semibold text-green-700"> Haz clic en "Guardar Cambios" para persistir en la base de datos.</span>
              )}
            </p>
          </div>

          <DraggableList
            items={skillsOrdenadas}
            onReorder={actualizarOrdenVisual}
            renderItem={renderSkill}
            className="space-y-3"
            scrollable={true}
            maxHeight="600px"
          />
        </div>
      )}
    </div>
  );
}
