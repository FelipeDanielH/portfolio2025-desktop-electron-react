import { useState, useCallback, useEffect } from 'react';
import type { HomeExperience } from '../../types/home.types';

export function useHomeExperience() {
  const [homeExperience, setHomeExperience] = useState<HomeExperience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeExperience.get();
      setHomeExperience(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener experiencia destacada');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeExperience) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeExperience.update(data);
      setHomeExperience(updated);
      setSuccess('Experiencia destacada actualizada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar experiencia destacada');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeExperience, loading, error, success, get, update };
} 