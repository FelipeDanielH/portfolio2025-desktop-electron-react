import { useState, useCallback, useEffect } from 'react';
import type { HomeCertifications } from '../../types/home.types';

export function useHomeCertifications() {
  const [homeCertifications, setHomeCertifications] = useState<HomeCertifications | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeCertifications.get();
      setHomeCertifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener certificaciones destacadas');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeCertifications) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeCertifications.update(data);
      setHomeCertifications(updated);
      setSuccess('Certificaciones destacadas actualizadas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar certificaciones destacadas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeCertifications, loading, error, success, get, update };
} 