import { useState } from 'react';
import EducationForm from './EducationForm';
import { EducationList } from './EducationList';
import { useEducation } from '../hooks/useEducation';
import type { Education, EducationFormData } from '../../types/education.types';

export function EducationEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const { create, update, loading } = useEducation();

  const handleEdit = (education: Education) => {
    setCurrentEducation(education);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentEducation(null);
    setIsEditing(false);
  };

  const handleSubmit = async (data: EducationFormData) => {
    try {
      if (currentEducation) {
        await update(currentEducation._id!, data);
      } else {
        await create(data);
      }
      setCurrentEducation(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting education:', error);
    }
  };

  const handleAddNew = () => {
    setCurrentEducation(null);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Educación</h1>
        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Formación
          </button>
        )}
      </div>

      {isEditing ? (
        <EducationForm
          mode={currentEducation ? "editar" : "crear"}
          initialData={currentEducation || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      ) : (
        <EducationList onEdit={handleEdit} />
      )}
    </div>
  );
} 