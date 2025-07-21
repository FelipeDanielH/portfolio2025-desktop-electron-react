import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';

export default function AboutInicioEditor() {
  // Estado para el string único de about
  const [about, setAbout] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar el valor único al montar
  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await window.electronAPI.homeAbout.get();
        if (data && Array.isArray(data.about)) {
          setAbout(data.about);
        } else if (data && typeof data.about === 'string') {
          setAbout([data.about]);
        } else {
          setAbout([]);
        }
      } catch (e) {
        setError('Error al cargar el texto de "Sobre mí" de inicio');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  // Guardar cambios
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.homeAbout.update({ about });
      if (result && Array.isArray(result.about)) {
        setAbout(result.about);
        setSuccessMessage('Texto de "Sobre mí" actualizado correctamente');
        setTimeout(() => setSuccessMessage(null), 2000);
      } else if (result && typeof result.about === 'string') {
        setAbout([result.about]);
        setSuccessMessage('Texto de "Sobre mí" actualizado correctamente');
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        setError('Error inesperado al guardar');
      }
    } catch (e) {
      setError('Error al guardar el texto de "Sobre mí"');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando texto de Sobre mí..." />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold">Editar texto "Sobre mí" de inicio</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
      <textarea
        value={about[0] || ''}
        onChange={e => setAbout([e.target.value])}
        placeholder="Escribe aquí tu presentación breve para la portada..."
        className="border p-2 rounded-md w-full min-h-[120px]"
      />
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        Guardar cambios
      </button>
    </div>
  );
} 