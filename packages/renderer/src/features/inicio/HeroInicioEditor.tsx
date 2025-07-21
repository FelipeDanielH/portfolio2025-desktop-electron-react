import { useHomeHero } from '../hooks/useHomeHero';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';
import { useState, useEffect } from 'react';

export default function HeroInicioEditor() {
  const {
    homeHero,
    loading,
    error,
    update
  } = useHomeHero();

  const [form, setForm] = useState(homeHero || {
    nombre: '', titulo: '', claim: '', telefono: '', ubicacion: '', email: '', linkedin: '', cv: '', boton_contacto: ''
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (homeHero) setForm(homeHero);
  }, [homeHero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await update(form);
    setSuccessMessage('Hero de inicio actualizado');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  if (loading) {
    return <LoadingSpinner text="Cargando hero..." />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold">Editar Hero de inicio</h2>
      {error && <ErrorMessage message={error} onDismiss={() => {}} />}
      {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded-md" />
        <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" className="border p-2 rounded-md" />
        <input name="claim" value={form.claim} onChange={handleChange} placeholder="Claim" className="border p-2 rounded-md md:col-span-2" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded-md" />
        <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="border p-2 rounded-md" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded-md" />
        <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn" className="border p-2 rounded-md" />
        <input name="cv" value={form.cv} onChange={handleChange} placeholder="URL CV" className="border p-2 rounded-md md:col-span-2" />
        <input name="boton_contacto" value={form.boton_contacto} onChange={handleChange} placeholder="Texto botón contacto" className="border p-2 rounded-md md:col-span-2" />
      </div>
      <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Guardar cambios</button>
    </div>
  );
} 