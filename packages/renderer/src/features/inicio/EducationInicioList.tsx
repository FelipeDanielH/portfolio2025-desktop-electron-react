import { useEffect, useMemo, useState } from 'react';
import { useHomeEducation } from '../hooks/useHomeEducation';
import { useEducation } from '../hooks/useEducation';
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

export default function EducationInicioList() {
  // Hooks para datos
  const { homeEducation, loading: loadingHome, error: errorHome, update } = useHomeEducation();
  const { educations, loading: loadingEdu, error: errorEdu } = useEducation();

  // Estado local para destacados
  const [selected, setSelected] = useState<string[]>(homeEducation?.education || []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Normalizar IDs tras cargar del backend
  useEffect(() => {
    if (homeEducation) {
      const ids = Array.isArray(homeEducation.education)
        ? homeEducation.education.map((item: any) =>
            typeof item === 'string' ? item : item._id
          )
        : [];
      setSelected(ids);
    }
  }, [homeEducation]);

  // Diccionario de educaciones por ID
  const eduById = useMemo(() => {
    const dict: Record<string, any> = {};
    for (const edu of educations || []) {
      if (edu && edu._id) dict[String(edu._id)] = edu;
    }
    return dict;
  }, [educations]);

  // IDs destacados inválidos
  const idsInvalidos = selected.filter(id => !id || !isMongoObjectId(id) || !eduById[String(id)]);

  // Destacadas: separar en formación y certificaciones
  const formacionDestacada = useMemo(() => {
    return selected
      .map(id => eduById[String(id)])
      .filter(Boolean)
      .filter((edu: any) => edu.tipo === 'formacion');
  }, [selected, eduById]);

  const certificacionesDestacadas = useMemo(() => {
    return selected
      .map(id => eduById[String(id)])
      .filter(Boolean)
      .filter((edu: any) => edu.tipo === 'certificacion');
  }, [selected, eduById]);

  // Todas las educaciones/certificaciones disponibles para añadir
  const disponibles = useMemo(() => {
    return (educations || []).filter(
      edu => edu && edu._id && !selected.includes(String(edu._id))
    );
  }, [educations, selected]);

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ education: selected });
      setSuccessMessage('Formación/certificaciones destacadas actualizadas');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (e) {
      // El error ya se maneja por el hook
    } finally {
      setSaving(false);
    }
  };

  // Añadir a destacados
  const handleAdd = (id: string) => {
    if (!selected.includes(id)) setSelected([...selected, id]);
  };

  // Quitar de destacados
  const handleRemove = (id: string) => {
    setSelected(selected.filter(eid => eid !== id));
  };

  if (loadingHome || loadingEdu) {
    return <LoadingSpinner text="Cargando formación/certificaciones..." />;
  }

  // Bloque visual para formación/certificación (destacados, sin descripción, con borde visible, sin borde inferior)
  function EduBlockDestacado({ edu, action, actionLabel, actionColor }: any) {
    return (
      <li key={typeof edu?._id === 'string' ? edu._id : JSON.stringify(edu?._id)} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 px-2 border border-indigo-300 rounded-md bg-white mb-2">
        <div className="flex-1">
          <div className="font-semibold text-base text-gray-800">{edu?.titulo}</div>
          <div className="text-sm text-gray-600">{edu?.institucion}</div>
          <div className="text-xs text-gray-400 mt-1">
            {formatFecha(edu?.fecha_inicio)}
            {edu?.fecha_fin ? ` - ${formatFecha(edu?.fecha_fin)}` : ' - Actual'}
          </div>
        </div>
        <div className="flex-shrink-0 mt-2 md:mt-0">
          <button
            onClick={action}
            className={`text-red-600 hover:underline text-xs border border-red-200 rounded px-2 py-0.5 bg-red-50 hover:bg-red-100 transition ${actionColor}`}
          >
            {actionLabel}
          </button>
        </div>
      </li>
    );
  }

  // Bloque visual para todas las formaciones/certificaciones (con etiqueta de tipo)
  function EduBlock({ edu, action, actionLabel, actionColor }: any) {
    return (
      <li key={typeof edu?._id === 'string' ? edu._id : JSON.stringify(edu?._id)} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-3 px-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-base text-gray-800">{edu?.titulo}</div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${edu?.tipo === 'formacion' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>{edu?.tipo === 'formacion' ? 'Formación' : 'Certificación'}</span>
          </div>
          <div className="text-sm text-gray-600">{edu?.institucion}</div>
          <div className="text-xs text-gray-400 mt-1">
            {formatFecha(edu?.fecha_inicio)}
            {edu?.fecha_fin ? ` - ${formatFecha(edu?.fecha_fin)}` : ' - Actual'}
          </div>
          {edu?.descripcion && <div className="text-xs text-gray-500 mt-1">{edu.descripcion}</div>}
        </div>
        <div className="flex-shrink-0 mt-2 md:mt-0">
          <button
            onClick={action}
            disabled={selected.includes(String(edu?._id))}
            className={`text-green-600 hover:underline text-xs disabled:opacity-40 border border-green-200 rounded px-2 py-0.5 bg-green-50 hover:bg-green-100 transition ${actionColor}`}
          >
            {actionLabel}
          </button>
        </div>
      </li>
    );
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
      {/* Grid de formación y certificaciones destacadas */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Formación destacada */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-2">Formación en inicio</h2>
          <ul>
            {formacionDestacada.length === 0 && idsInvalidos.length === 0 ? (
              <li className="col-span-full text-gray-500 px-3 py-2">No hay formación destacada.</li>
            ) : (
              formacionDestacada.map((edu: any) => (
                <EduBlockDestacado
                  key={typeof edu?._id === 'string' ? edu._id : JSON.stringify(edu?._id)}
                  edu={edu}
                  action={() => handleRemove(String(edu?._id))}
                  actionLabel="Quitar de inicio"
                  actionColor=""
                />
              ))
            )}
          </ul>
        </div>
        {/* Certificaciones destacadas */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-2">Certificaciones en inicio</h2>
          <ul>
            {certificacionesDestacadas.length === 0 && idsInvalidos.length === 0 ? (
              <li className="col-span-full text-gray-500 px-3 py-2">No hay certificaciones destacadas.</li>
            ) : (
              certificacionesDestacadas.map((edu: any) => (
                <EduBlockDestacado
                  key={typeof edu?._id === 'string' ? edu._id : JSON.stringify(edu?._id)}
                  edu={edu}
                  action={() => handleRemove(String(edu?._id))}
                  actionLabel="Quitar de inicio"
                  actionColor=""
                />
              ))
            )}
          </ul>
        </div>
      </div>
      {/* Lista de todas las educaciones/certificaciones */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold mb-2">Todas las formaciones y certificaciones</h2>
        <div className="rounded-lg border border-gray-300 bg-white shadow-sm p-2 min-h-[120px]">
          <ul className="divide-y divide-gray-200">
            {disponibles.length === 0 && (
              <li className="text-xs text-gray-400 px-6 py-2 italic border-b border-gray-200 text-center">No hay formaciones ni certificaciones para mostrar.</li>
            )}
            {disponibles.map((edu: any) => (
              <EduBlock
                key={typeof edu?._id === 'string' ? edu._id : JSON.stringify(edu?._id)}
                edu={edu}
                action={() => handleAdd(String(edu?._id))}
                actionLabel="Añadir a inicio"
                actionColor=""
              />
            ))}
          </ul>
        </div>
        {errorHome && <ErrorMessage message={errorHome} onDismiss={() => {}} />}
        {errorEdu && <ErrorMessage message={errorEdu} onDismiss={() => {}} />}
      </div>
    </div>
  );
} 