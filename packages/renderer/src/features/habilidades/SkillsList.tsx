import { useSkills } from '../hooks/useSkills';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';
import SkillForm from './SkillForm';
import { useState } from 'react';
import type { SkillFormData } from '../../types/skills.types';

export default function SkillsList() {
  const {
    skills,
    categorias,
    loading,
    error,
    deleteSkill,
    setEditingSkill,
    clearError,
    createSkill,
    selectedSkill,
    loadSkills
  } = useSkills();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
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

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: SkillFormData) => {
    await createSkill(data);
    setShowForm(false);
    loadSkills();
    setSuccessMessage('Habilidad creada correctamente');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const getCategoriaName = (categoriaId: string) => {
    const categoria = categorias.find(c => c._id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Listado de habilidades</h2>
        <LoadingSpinner text="Cargando habilidades..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Listado de habilidades</h2>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
        >
          + Agregar habilidad
        </button>
      </div>

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

      {showForm && (
        <div className="bg-white border rounded-md p-4 mb-4">
          <SkillForm
            skill={selectedSkill}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {skills.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">No hay habilidades registradas.</div>
      ) : (
        skills.map(skill => (
          <div key={skill._id} className="border rounded-md p-4 bg-gray-50 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{skill.tecnologia}</div>
                <div className="text-sm text-gray-600">
                  {getCategoriaName(skill.categoria_id)} - {skill.nivel} - Puntuación: {skill.puntuacion}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(skill)} 
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(skill._id!)} 
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {skill.descripcion && (
              <div className="text-sm text-gray-700">{skill.descripcion}</div>
            )}
            {skill.conceptos && skill.conceptos.length > 0 && (
              <div className="text-xs text-gray-500">
                Conceptos: {skill.conceptos.map(c => c.nombre).join(", ")}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
} 