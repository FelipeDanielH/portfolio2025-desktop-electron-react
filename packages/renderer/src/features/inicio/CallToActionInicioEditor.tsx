import { useHomeCallToAction } from '../hooks/useHomeCallToAction';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';
import { useState, useEffect } from 'react';

export default function CallToActionInicioEditor() {
  const {
    homeCallToAction,
    loading,
    error,
    update
  } = useHomeCallToAction();

  const [form, setForm] = useState(homeCallToAction || {
    titulo: '', subtitulo: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (homeCallToAction) setForm(homeCallToAction);
  }, [homeCallToAction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await update(form);
    setSuccessMessage('Llamada a la acción actualizada');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  if (loading) {
    return <LoadingSpinner text="Cargando llamada a la acción..." />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold">Editar Llamada a la Acción de inicio</h2>
      {error && <ErrorMessage message={error} onDismiss={() => {}} />}
      {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
      <div className="grid grid-cols-1 gap-4">
        <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" className="border p-2 rounded-md" />
        <input name="subtitulo" value={form.subtitulo} onChange={handleChange} placeholder="Subtítulo" className="border p-2 rounded-md" />
      </div>
      <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Guardar cambios</button>
    </div>
  );
} 