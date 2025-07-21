import { useState, useCallback, useEffect } from 'react';
import type { HomeProjects } from '../../types/home.types';

export function useHomeProjects() {
  const [homeProjects, setHomeProjects] = useState<HomeProjects | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeProjects.get();
      setHomeProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener proyectos destacados');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeProjects) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeProjects.update(data);
      setHomeProjects(updated);
      setSuccess('Proyectos destacados actualizados');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar proyectos destacados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeProjects, loading, error, success, get, update };
} 