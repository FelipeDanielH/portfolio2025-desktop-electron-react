import { useState, useEffect, useCallback } from 'react';
import type { Categoria } from '../../types/skills.types';

export function useCategories() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLoadingState = useCallback((loading: boolean) => {
    setLoading(loading);
    if (!loading) setError(null);
  }, []);

  const setErrorState = useCallback((error: string) => {
    setError(error);
    setLoading(false);
  }, []);

  const loadCategorias = useCallback(async () => {
    try {
      setLoadingState(true);
      const categorias = await window.electronAPI.categories.getOrdered();
      setCategorias(categorias);
      setLoadingState(false);
    } catch (error) {
      setErrorState('Error al cargar las categorías');
    }
  }, []);

  const createCategoria = useCallback(async (data: { nombre: string; orden: number }) => {
    try {
      setLoadingState(true);
      const newCategoria = await window.electronAPI.categories.create(data);
      setCategorias(prev => [...prev, newCategoria]);
      setLoadingState(false);
      return newCategoria;
    } catch (error) {
      setErrorState('Error al crear la categoría');
      throw error;
    }
  }, []);

  const updateCategoria = useCallback(async (id: string, data: Partial<Categoria>) => {
    try {
      setLoadingState(true);
      const updatedCategoria = await window.electronAPI.categories.update(id, data);
      setCategorias(prev => 
        prev.map(c => c._id === id ? updatedCategoria : c)
      );
      setLoadingState(false);
      return updatedCategoria;
    } catch (error) {
      setErrorState('Error al actualizar la categoría');
      throw error;
    }
  }, []);

  const deleteCategoria = useCallback(async (id: string) => {
    try {
      setLoadingState(true);
      await window.electronAPI.categories.delete(id);
      setCategorias(prev => prev.filter(c => c._id !== id));
      setLoadingState(false);
    } catch (error) {
      setErrorState('Error al eliminar la categoría');
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar categorías al inicializar el hook
  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  return {
    // State
    categorias,
    loading,
    error,
    
    // Actions
    loadCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    clearError,
  };
} 