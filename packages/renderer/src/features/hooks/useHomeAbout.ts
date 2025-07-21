import { useState, useCallback, useEffect } from 'react';
import type { HomeAbout } from '../../types/home.types';

export function useHomeAbout() {
  const [homeAbout, setHomeAbout] = useState<HomeAbout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeAbout.get();
      setHomeAbout(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener about destacado');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeAbout) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeAbout.update(data);
      setHomeAbout(updated);
      setSuccess('About destacado actualizado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar about destacado');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeAbout, loading, error, success, get, update };
} 