import { useHomeContact } from '../hooks/useHomeContact';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';
import { useState, useEffect } from 'react';

export default function ContactInicioEditor() {
  const {
    homeContact,
    loading,
    error,
    update
  } = useHomeContact();

  const [form, setForm] = useState(homeContact || {
    email: '', telefono: '', linkedin: '', github: '', portfolio_url: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (homeContact) setForm(homeContact);
  }, [homeContact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await update(form);
    setSuccessMessage('Contacto de inicio actualizado');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  if (loading) {
    return <LoadingSpinner text="Cargando contacto..." />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold">Editar Contacto de inicio</h2>
      {error && <ErrorMessage message={error} onDismiss={() => {}} />}
      {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded-md" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded-md" />
        <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn" className="border p-2 rounded-md" />
        <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub" className="border p-2 rounded-md" />
        <input name="portfolio_url" value={form.portfolio_url} onChange={handleChange} placeholder="URL Portafolio" className="border p-2 rounded-md md:col-span-2" />
      </div>
      <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Guardar cambios</button>
    </div>
  );
} 