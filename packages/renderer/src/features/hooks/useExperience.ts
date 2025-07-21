import { useState, useCallback, useEffect, useRef } from 'react';
import type { Experience, ExperienceFormData } from '../../types/experience.types';

interface UseExperienceReturn {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  getAll: () => Promise<void>;
  create: (data: ExperienceFormData) => Promise<void>;
  update: (id: string, data: Partial<Experience>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  clearMessages: () => void;
}

export function useExperience(): UseExperienceReturn {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const getAll = useCallback(async () => {
    // Evitar múltiples llamadas usando ref
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await window.electronAPI.experience.getAll();
      setExperiences(data || []);
    } catch (err) {
      console.error('❌ useExperience: Error getting experiences:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener experiencia');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: ExperienceFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newExperience = await window.electronAPI.experience.create(data);
      setExperiences(prev => [...prev, newExperience]);
      setSuccessMessage('Experiencia creada exitosamente');
    } catch (err) {
      console.error('❌ useExperience: Error creating experience:', err);
      setError(err instanceof Error ? err.message : 'Error al crear experiencia');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<Experience>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedExperience = await window.electronAPI.experience.update(id, data);
      setExperiences(prev => prev.map(experience => experience._id === id ? updatedExperience : experience));
      setSuccessMessage('Experiencia actualizada exitosamente');
    } catch (err) {
      console.error('❌ useExperience: Error updating experience:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar experiencia');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.experience.delete(id);
      setExperiences(prev => prev.filter(experience => experience._id !== id));
      setSuccessMessage('Experiencia eliminada exitosamente');
    } catch (err) {
      console.error('❌ useExperience: Error deleting experience:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar experiencia');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar experiencia al montar el hook solo una vez
  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    experiences,
    loading,
    error,
    successMessage,
    getAll,
    create,
    update,
    delete: deleteExperience,
    clearMessages,
  };
} 