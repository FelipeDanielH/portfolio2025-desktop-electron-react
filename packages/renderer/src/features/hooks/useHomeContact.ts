import { useState, useCallback, useEffect } from 'react';
import type { HomeContact } from '../../types/home.types';

export function useHomeContact() {
  const [homeContact, setHomeContact] = useState<HomeContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electronAPI.homeContact.get();
      setHomeContact(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener contacto de inicio');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: HomeContact) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await window.electronAPI.homeContact.update(data);
      setHomeContact(updated);
      setSuccess('Contacto de inicio actualizado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar contacto de inicio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { homeContact, loading, error, success, get, update };
} 