import { useState, useCallback, useEffect } from 'react';
import type { HomeCallToAction } from '../../types/home.types';

export function useHomeCallToAction() {
  const [homeCallToAction, setHomeCallToAction] = useState<HomeCallToAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeCallToAction.get();
      setHomeCallToAction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener call to action de inicio');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeCallToAction) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeCallToAction.update(data);
      setHomeCallToAction(updated);
      setSuccess('Call to action de inicio actualizado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar call to action de inicio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeCallToAction, loading, error, success, get, update };
} 