import { useState, useCallback, useEffect } from 'react';
import type { HomeSkills } from '../../types/home.types';

export function useHomeSkills() {
  const [homeSkills, setHomeSkills] = useState<HomeSkills | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeSkills.get();
      setHomeSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener skills destacados');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeSkills) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeSkills.update(data);
      setHomeSkills(updated);
      setSuccess('Skills destacados actualizados');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar skills destacados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeSkills, loading, error, success, get, update };
} 