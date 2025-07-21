import { useState, useCallback, useEffect } from 'react';
import type { HomeHero } from '../../types/home.types';

export function useHomeHero() {
  const [homeHero, setHomeHero] = useState<HomeHero | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeHero.get();
      setHomeHero(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener hero de inicio');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeHero) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeHero.update(data);
      setHomeHero(updated);
      setSuccess('Hero de inicio actualizado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar hero de inicio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeHero, loading, error, success, get, update };
} 