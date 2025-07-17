import { useState, useEffect, useCallback } from "react";
import type { BloqueResumen } from "../../types/electron-api";

export default function useResumen() {
  const [bloques, setBloques] = useState<BloqueResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar bloques al iniciar
  useEffect(() => {
    cargarBloques();
    // eslint-disable-next-line
  }, []);

  const cargarBloques = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await window.electronAPI.getResumen();
      if (response) {
        setBloques(response.bloques || []);
      }
    } catch (error) {
      setError('Error al cargar los bloques de resumen');
    } finally {
      setCargando(false);
    }
  }, []);

  const guardarBloques = useCallback(async () => {
    try {
      setGuardando(true);
      setError(null);
      const response = await window.electronAPI.saveResumen({ bloques });
      if (!response) throw new Error();
    } catch (error) {
      setError('Error al guardar los bloques de resumen');
    } finally {
      setGuardando(false);
    }
  }, [bloques]);

  const agregarBloque = useCallback(() => {
    setBloques(prev => ([
      ...prev,
      { titulo: "", contenido: "", orden: prev.length + 1 }
    ]));
  }, []);

  const actualizarBloque = useCallback((index: number, campo: keyof BloqueResumen, valor: string | number) => {
    setBloques(prev => {
      const copia = [...prev];
      (copia[index] as any)[campo] = valor;
      return copia;
    });
  }, []);

  const eliminarBloque = useCallback((index: number) => {
    setBloques(prev => {
      const copia = prev.filter((_, i) => i !== index);
      return copia.map((bloque, i) => ({ ...bloque, orden: i + 1 }));
    });
  }, []);

  const moverBloque = useCallback((index: number, direccion: 'arriba' | 'abajo') => {
    setBloques(prev => {
      const copia = [...prev];
      const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
      if (nuevoIndex >= 0 && nuevoIndex < copia.length) {
        [copia[index], copia[nuevoIndex]] = [copia[nuevoIndex], copia[index]];
        copia[index].orden = index + 1;
        copia[nuevoIndex].orden = nuevoIndex + 1;
      }
      return copia;
    });
  }, []);

  return {
    bloques,
    cargando,
    guardando,
    error,
    agregarBloque,
    actualizarBloque,
    eliminarBloque,
    moverBloque,
    guardarBloques
  };
} 