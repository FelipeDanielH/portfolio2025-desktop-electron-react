import { useState } from 'react';
import ExperienceForm from './ExperienceForm';
import { ExperienceList } from './ExperienceList';
import { useExperience } from '../hooks/useExperience';
import type { Experience, ExperienceFormData } from '../../types/experience.types';

export function ExperienceEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const { create, update } = useExperience();

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentExperience(null);
    setIsEditing(false);
  };

  const handleSubmit = async (data: ExperienceFormData) => {
    try {
      if (currentExperience) {
        await update(currentExperience._id!, data);
      } else {
        await create(data);
      }
      setCurrentExperience(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting experience:', error);
    }
  };

  const handleAddNew = () => {
    setCurrentExperience(null);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Experiencia</h1>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Experiencia
          </button>
        )}
      </div>

      {isEditing ? (
        <ExperienceForm
          mode={currentExperience ? "editar" : "crear"}
          initialData={currentExperience || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <ExperienceList onEdit={handleEdit} />
      )}
    </div>
  );
} 