import { useState, useEffect, useCallback } from 'react';
import type { Skill, Categoria, SkillsState, SkillFormData, CategoriaFormData } from '../../types/skills.types';

export function useSkills() {
  const [state, setState] = useState<SkillsState>({
    skills: [],
    categorias: [],
    loading: false,
    error: null,
    selectedSkill: null,
    selectedCategoria: null,
    isEditingSkill: false,
    isEditingCategoria: false,
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadSkills();
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  // Skills CRUD
  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      const skills = await window.electronAPI.skills.getOrdered();
      setState(prev => ({ ...prev, skills, loading: false }));
    } catch (error) {
      console.error('❌ ERROR LOADING SKILLS:', error);
      setError('Error al cargar las habilidades');
    }
  }, []);

  const createSkill = useCallback(async (data: SkillFormData) => {
    try {
      setLoading(true);
      
      // Obtener el siguiente orden disponible
      const maxOrden = state.skills.length > 0 
        ? Math.max(...state.skills.map(s => s.orden || 1))
        : 0;
      const nextOrden = maxOrden + 1;
      

      
      const newSkill = await window.electronAPI.skills.create({
        ...data,
        orden: nextOrden
      });
      
      setState(prev => ({ 
        ...prev, 
        skills: [...prev.skills, newSkill],
        loading: false,
        isEditingSkill: false 
      }));
      return newSkill;
    } catch (error) {
      setError('Error al crear la habilidad');
      throw error;
    }
  }, [state.skills]);

  const updateSkill = useCallback(async (id: string, data: Partial<Skill>) => {
    try {
      setLoading(true);
      const updatedSkill = await window.electronAPI.skills.update(id, data);
      setState(prev => ({ 
        ...prev, 
        skills: prev.skills.map(s => s._id === id ? updatedSkill : s),
        loading: false,
        isEditingSkill: false,
        selectedSkill: null
      }));
      return updatedSkill;
    } catch (error) {
      setError('Error al actualizar la habilidad');
      throw error;
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await window.electronAPI.skills.delete(id);
      setState(prev => ({ 
        ...prev, 
        skills: prev.skills.filter(s => s._id !== id),
        loading: false,
        selectedSkill: null
      }));
    } catch (error) {
      setError('Error al eliminar la habilidad');
      throw error;
    }
  }, []);

  const getSkillById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const skill = await window.electronAPI.skills.getById(id);
      setState(prev => ({ ...prev, selectedSkill: skill, loading: false }));
      return skill;
    } catch (error) {
      setError('Error al obtener la habilidad');
      throw error;
    }
  }, []);

  // Categories CRUD - Ahora delegado al hook useCategories
  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const categorias = await window.electronAPI.categories.getOrdered();
      setState(prev => ({ ...prev, categorias, loading: false }));
    } catch (error) {
      setError('Error al cargar las categorías');
    }
  }, []);

  const createCategoria = useCallback(async (data: CategoriaFormData) => {
    try {
      setLoading(true);
      const newCategoria = await window.electronAPI.categories.create(data);
      setState(prev => ({ 
        ...prev, 
        categorias: [...prev.categorias, newCategoria],
        loading: false,
        isEditingCategoria: false 
      }));
      return newCategoria;
    } catch (error) {
      setError('Error al crear la categoría');
      throw error;
    }
  }, []);

  const updateCategoria = useCallback(async (id: string, data: Partial<Categoria>) => {
    try {
      setLoading(true);
      const updatedCategoria = await window.electronAPI.categories.update(id, data);
      setState(prev => ({ 
        ...prev, 
        categorias: prev.categorias.map(c => c._id === id ? updatedCategoria : c),
        loading: false,
        isEditingCategoria: false,
        selectedCategoria: null
      }));
      return updatedCategoria;
    } catch (error) {
      setError('Error al actualizar la categoría');
      throw error;
    }
  }, []);

  const deleteCategoria = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await window.electronAPI.categories.delete(id);
      setState(prev => ({ 
        ...prev, 
        categorias: prev.categorias.filter(c => c._id !== id),
        loading: false,
        selectedCategoria: null
      }));
    } catch (error) {
      setError('Error al eliminar la categoría');
      throw error;
    }
  }, []);

  // UI State helpers
  const setEditingSkill = useCallback((skill: Skill | null) => {
    setState(prev => ({ 
      ...prev, 
      selectedSkill: skill,
      isEditingSkill: !!skill 
    }));
  }, []);

  const setEditingCategoria = useCallback((categoria: Categoria | null) => {
    setState(prev => ({ 
      ...prev, 
      selectedCategoria: categoria,
      isEditingCategoria: !!categoria 
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    
    // Skills actions
    loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillById,
    
    // Categories actions
    loadCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    
    // UI helpers
    setEditingSkill,
    setEditingCategoria,
    clearError,
  };
} 