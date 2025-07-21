import { useEffect, useMemo, useState } from 'react';
import { useHomeExperience } from '../hooks/useHomeExperience';
import { useExperience } from '../hooks/useExperience';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';

function isMongoObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

function formatFecha(fecha: string | null | undefined) {
  if (!fecha) return '';
  // Espera formato YYYY-MM
  const [y, m] = fecha.split('-');
  return `${m}/${y}`;
}

export default function ExperienceInicioList() {
  // Hooks para datos
  const { homeExperience, loading: loadingHome, error: errorHome, update } = useHomeExperience();
  const { experiences, loading: loadingExp, error: errorExp } = useExperience();

  // Estado local para destacados
  const [selected, setSelected] = useState<string[]>(homeExperience?.experience || []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sincronizar destacados cuando cambian en el backend
  useEffect(() => {
    if (homeExperience) {
      // Normaliza: si el backend devuelve objetos, extrae los IDs
      const ids = Array.isArray(homeExperience.experience)
        ? homeExperience.experience.map((item: any) =>
            typeof item === 'string' ? item : item._id
          )
        : [];
      setSelected(ids);
    }
  }, [homeExperience]);

  // Diccionario de experiencias por ID
  const expById = useMemo(() => {
    const dict: Record<string, any> = {};
    for (const exp of experiences || []) {
      if (exp && exp._id) dict[String(exp._id)] = exp;
    }
    return dict;
  }, [experiences]);

  // IDs destacados inválidos
  const idsInvalidos = selected.filter(id => !id || !isMongoObjectId(id) || !expById[String(id)]);

  // Función de ordenamiento: primero las que no tienen fecha_fin, luego por fecha_fin descendente
  function ordenarExperiencias(arr: any[]) {
    return [...arr].sort((a, b) => {
      if (!a.fecha_fin && b.fecha_fin) return -1;
      if (a.fecha_fin && !b.fecha_fin) return 1;
      if (!a.fecha_fin && !b.fecha_fin) return 0;
      // Ambas tienen fecha_fin, comparar descendente
      return b.fecha_fin.localeCompare(a.fecha_fin);
    });
  }

  // Experiencias disponibles para añadir (no están en destacados)
  const disponibles = useMemo(() => {
    return ordenarExperiencias((experiences || []).filter(
      exp => exp && exp._id && !selected.includes(String(exp._id))
    ));
  }, [experiences, selected]);

  // Experiencias destacadas (ordenadas)
  const destacadas = useMemo(() => {
    return ordenarExperiencias(selected
      .map(id => expById[String(id)])
      .filter(Boolean));
  }, [selected, expById]);

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ experience: selected });
      setSuccessMessage('Experiencia destacada actualizada');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (e) {
      // El error ya se maneja por el hook
    } finally {
      setSaving(false);
    }
  };

  // Añadir experiencia a destacados
  const handleAdd = (id: string) => {
    if (!selected.includes(id)) setSelected([...selected, id]);
  };

  // Quitar experiencia de destacados
  const handleRemove = (id: string) => {
    setSelected(selected.filter(eid => eid !== id));
  };

  if (loadingHome || loadingExp) {
    return <LoadingSpinner text="Cargando experiencia..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Botón de guardar y mensaje de éxito, centrados y separados */}
      <div className="flex flex-col items-center gap-2 mb-2">
        {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />}
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 shadow font-semibold"
          disabled={saving}
        >
          Guardar cambios
        </button>
      </div>
      {/* Lista de experiencias destacadas */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold mb-2">Experiencias en inicio</h2>
        <div className="rounded-lg border border-gray-300 bg-white shadow-sm p-2 min-h-[120px]">
          {idsInvalidos.length > 0 && (
            <div className="mb-2 text-yellow-700 text-xs px-3 pt-2">
              <span className="font-semibold">IDs inválidos en destacados:</span>
              <ul className="list-disc ml-5">
                {idsInvalidos.map(id => (
                  <li key={String(id)} className="italic">
                    [{typeof id === 'string' ? id : JSON.stringify(id)}]
                    <button onClick={() => handleRemove(String(id))} className="text-red-600 hover:underline ml-2">Quitar</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {destacadas.length === 0 && idsInvalidos.length === 0 ? (
            <div className="text-gray-500 px-3 py-2">No hay experiencias destacadas.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {destacadas.map((exp: any) => (
                <li key={typeof exp?._id === 'string' ? exp._id : JSON.stringify(exp?._id)} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 px-2">
                  <div className="flex-1">
                    <div className="font-semibold text-base text-gray-800">{exp?.rol}</div>
                    <div className="text-sm text-gray-600">{exp?.empresa} &middot; {exp?.ubicacion}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatFecha(exp?.fecha_inicio)}
                      {exp?.fecha_fin ? ` - ${formatFecha(exp?.fecha_fin)}` : ' - Actual'}
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-2 md:mt-0">
                    <button
                      onClick={() => handleRemove(String(exp?._id))}
                      className="text-red-600 hover:underline text-xs border border-red-200 rounded px-2 py-0.5 bg-red-50 hover:bg-red-100 transition"
                    >
                      Quitar de inicio
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Lista de todas las experiencias */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold mb-2">Todas las experiencias</h2>
        <div className="rounded-lg border border-gray-300 bg-white shadow-sm p-2 min-h-[120px]">
          <ul className="divide-y divide-gray-200">
            {disponibles.length === 0 && (
              <li className="text-xs text-gray-400 px-6 py-2 italic border-b border-gray-200 text-center">No hay experiencias para mostrar.</li>
            )}
            {disponibles.map((exp: any) => (
              <li key={typeof exp?._id === 'string' ? exp._id : JSON.stringify(exp?._id)} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 px-2">
                <div className="flex-1">
                  <div className="font-semibold text-base text-gray-800">{exp?.rol}</div>
                  <div className="text-sm text-gray-600">{exp?.empresa} &middot; {exp?.ubicacion}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatFecha(exp?.fecha_inicio)}
                    {exp?.fecha_fin ? ` - ${formatFecha(exp?.fecha_fin)}` : ' - Actual'}
                  </div>
                </div>
                <div className="flex-shrink-0 mt-2 md:mt-0">
                  <button
                    onClick={() => handleAdd(String(exp?._id))}
                    disabled={selected.includes(String(exp?._id))}
                    className="text-green-600 hover:underline text-xs disabled:opacity-40 border border-green-200 rounded px-2 py-0.5 bg-green-50 hover:bg-green-100 transition"
                  >
                    Añadir a inicio
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {errorHome && <ErrorMessage message={errorHome} onDismiss={() => {}} />}
        {errorExp && <ErrorMessage message={errorExp} onDismiss={() => {}} />}
      </div>
    </div>
  );
} 