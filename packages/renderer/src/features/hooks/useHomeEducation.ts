import { useState, useCallback, useEffect } from 'react';
import type { HomeEducation } from '../../types/home.types';

export function useHomeEducation() {
  const [homeEducation, setHomeEducation] = useState<import('../../types/home.types').HomeEducation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeEducation.get();
      setHomeEducation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener formación destacada');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeEducation) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeEducation.update(data);
      setHomeEducation(updated);
      setSuccess('Formación destacada actualizada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar formación destacada');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeEducation, loading, error, success, get, update };
} 