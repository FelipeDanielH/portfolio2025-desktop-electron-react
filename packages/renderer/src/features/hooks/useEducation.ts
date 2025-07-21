import { useState, useCallback, useEffect, useRef } from 'react';
import type { Education, EducationFormData } from '../../types/education.types';

interface UseEducationReturn {
  educations: Education[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  getAll: () => Promise<void>;
  create: (data: EducationFormData) => Promise<void>;
  update: (id: string, data: Partial<Education>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  getByType: (tipo: "formacion" | "certificacion") => Promise<void>;
  getByStatus: (estado: "En curso" | "Completado" | "Abandonado") => Promise<void>;
  clearMessages: () => void;
}

function normalizeTipo(tipo: any): 'formacion' | 'certificacion' {
  return tipo === 'certificacion' ? 'certificacion' : 'formacion';
}

function normalizeEstado(estado: any): 'En curso' | 'Completado' | 'Abandonado' {
  if (estado === 'Completado') return 'Completado';
  if (estado === 'Abandonado') return 'Abandonado';
  return 'En curso';
}

export function useEducation(): UseEducationReturn {
  const [educations, setEducations] = useState<Education[]>([]);
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
      
      // Obtener la URL del backend desde el main process (por IPC)
      const data = await window.electronAPI.education.getAll(); // Aquí podrías usar backendUrl si tu preload lo soporta
      // Filtrar solo los que tengan los campos de Education
      const educations: Education[] = (data || []).filter((item: any) =>
        (item.tipo === 'formacion' || item.tipo === 'certificacion') &&
        typeof item.institucion === 'string' &&
        (item.estado === 'En curso' || item.estado === 'Completado' || item.estado === 'Abandonado') &&
        typeof item.titulo === 'string'
      ).map((item: any) => ({
        ...item,
        tipo: normalizeTipo(item.tipo),
        institucion: String(item.institucion),
        estado: normalizeEstado(item.estado),
        titulo: String(item.titulo),
      }));
      setEducations(educations);
    } catch (err) {
      console.error('❌ useEducation: Error getting educations:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener educación');
      setEducations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: EducationFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Asegurarse de que data tenga los campos requeridos
      const newEducationRaw = await window.electronAPI.education.create(data);
      if (newEducationRaw && typeof newEducationRaw.tipo !== 'undefined' && typeof newEducationRaw.institucion !== 'undefined' && typeof newEducationRaw.estado !== 'undefined' && typeof newEducationRaw.titulo !== 'undefined') {
        const newEducation: Education = {
          ...newEducationRaw,
          tipo: normalizeTipo(newEducationRaw.tipo),
          institucion: String(newEducationRaw.institucion || ''),
          estado: normalizeEstado(newEducationRaw.estado),
          titulo: String(newEducationRaw.titulo || ''),
        };
        setEducations(prev => [...prev, newEducation]);
      }
      setSuccessMessage('Educación creada exitosamente');
    } catch (err) {
      console.error('❌ useEducation: Error creating education:', err);
      setError(err instanceof Error ? err.message : 'Error al crear educación');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<Education>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedEducationRaw = await window.electronAPI.education.update(id, data);
      if (updatedEducationRaw && typeof updatedEducationRaw.tipo !== 'undefined' && typeof updatedEducationRaw.institucion !== 'undefined' && typeof updatedEducationRaw.estado !== 'undefined' && typeof updatedEducationRaw.titulo !== 'undefined') {
        const updatedEducation: Education = {
          ...updatedEducationRaw,
          tipo: normalizeTipo(updatedEducationRaw.tipo),
          institucion: String(updatedEducationRaw.institucion || ''),
          estado: normalizeEstado(updatedEducationRaw.estado),
          titulo: String(updatedEducationRaw.titulo || ''),
        };
        setEducations(prev => prev.map(education => education._id === id ? updatedEducation : education));
      }
      setSuccessMessage('Educación actualizada exitosamente');
    } catch (err) {
      console.error('❌ useEducation: Error updating education:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar educación');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEducation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.education.delete(id);
      setEducations(prev => prev.filter(education => education._id !== id));
      setSuccessMessage('Educación eliminada exitosamente');
    } catch (err) {
      console.error('❌ useEducation: Error deleting education:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar educación');
    } finally {
      setLoading(false);
    }
  }, []);

  const getByType = useCallback(async (tipo: "formacion" | "certificacion") => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await window.electronAPI.education.getAll();
      const educationsByType: Education[] = (data || []).filter((item: any) =>
        item.tipo === tipo &&
        typeof item.institucion === 'string' &&
        (item.estado === 'En curso' || item.estado === 'Completado' || item.estado === 'Abandonado') &&
        typeof item.titulo === 'string'
      ).map((item: any) => ({
        ...item,
        tipo: normalizeTipo(item.tipo),
        institucion: String(item.institucion),
        estado: normalizeEstado(item.estado),
        titulo: String(item.titulo),
      }));
      setEducations(educationsByType);
    } catch (err) {
      console.error('❌ useEducation: Error getting education by type:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener educación por tipo');
    } finally {
      setLoading(false);
    }
  }, []);

  const getByStatus = useCallback(async (estado: "En curso" | "Completado" | "Abandonado") => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await window.electronAPI.education.getAll();
      const educationsByStatus: Education[] = (data || []).filter((item: any) =>
        (item.estado === estado) &&
        (item.tipo === 'formacion' || item.tipo === 'certificacion') &&
        typeof item.institucion === 'string' &&
        typeof item.titulo === 'string'
      ).map((item: any) => ({
        ...item,
        tipo: normalizeTipo(item.tipo),
        institucion: String(item.institucion),
        estado: normalizeEstado(item.estado),
        titulo: String(item.titulo),
      }));
      setEducations(educationsByStatus);
    } catch (err) {
      console.error('❌ useEducation: Error getting education by status:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener educación por estado');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar educación al montar el hook solo una vez
  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    educations,
    loading,
    error,
    successMessage,
    getAll,
    create,
    update,
    delete: deleteEducation,
    getByType,
    getByStatus,
    clearMessages,
  };
} 