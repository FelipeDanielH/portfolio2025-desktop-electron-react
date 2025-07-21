import { useEffect, useMemo, useState } from 'react';
import { useHomeSkills } from '../hooks/useHomeSkills';
import { useSkills } from '../hooks/useSkills';
import { useCategories } from '../hooks/useCategories';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SuccessMessage from '../../components/ui/SuccessMessage';

function isMongoObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default function SkillsInicioList() {
  // Hooks para datos
  const { homeSkills, loading: loadingHome, error: errorHome, update } = useHomeSkills();
  const { skills, loading: loadingSkills, error: errorSkills } = useSkills();
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategories();

  // Estado local para destacados
  const [selected, setSelected] = useState<string[]>(homeSkills?.skills || []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sincronizar destacados cuando cambian en el backend
  useEffect(() => {
    if (homeSkills) setSelected(homeSkills.skills || []);
  }, [homeSkills]);

  // Diccionario de habilidades por ID
  const skillsById = useMemo(() => {
    const dict: Record<string, any> = {};
    for (const skill of skills || []) {
      if (skill && skill._id) dict[String(skill._id)] = skill;
    }
    return dict;
  }, [skills]);

  // Diccionario de categorías por ID
  const categoriasById = useMemo(() => {
    const dict: Record<string, any> = {};
    for (const cat of categorias || []) {
      if (cat && cat._id) dict[String(cat._id)] = cat;
    }
    return dict;
  }, [categorias]);

  // Agrupar destacadas por categoría
  const destacadasPorCategoria = useMemo(() => {
    const dict: Record<string, any[]> = {};
    for (const id of selected) {
      if (!id || !isMongoObjectId(id)) continue;
      const skill = skillsById[String(id)];
      if (skill && skill.categoria_id) {
        const catId = String(skill.categoria_id);
        if (!dict[catId]) dict[catId] = [];
        dict[catId].push(skill);
      }
    }
    return dict;
  }, [selected, skillsById]);

  // IDs destacados inválidos
  const idsInvalidos = selected.filter(id => !id || !isMongoObjectId(id) || !skillsById[String(id)]);

  // Habilidades disponibles para añadir (no están en destacados)
  const disponiblesPorCategoria = useMemo(() => {
    const dict: Record<string, any[]> = {};
    for (const skill of skills || []) {
      if (!skill || !skill._id || !skill.categoria_id) continue;
      if (selected.includes(String(skill._id))) continue;
      const catId = String(skill.categoria_id);
      if (!dict[catId]) dict[catId] = [];
      dict[catId].push(skill);
    }
    return dict;
  }, [skills, selected]);

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ skills: selected });
      setSuccessMessage('Habilidades destacadas actualizadas');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (e) {
      // El error ya se maneja por el hook
    } finally {
      setSaving(false);
    }
  };

  // Añadir habilidad a destacados
  const handleAdd = (id: string) => {
    if (!selected.includes(id)) setSelected([...selected, id]);
  };

  // Quitar habilidad de destacados
  const handleRemove = (id: string) => {
    setSelected(selected.filter(sid => sid !== id));
  };

  if (loadingHome || loadingSkills || loadingCategorias) {
    return <LoadingSpinner text="Cargando habilidades..." />;
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
      {/* Contenedor de tablas igualadas */}
      <div className="flex flex-row gap-8 w-full">
        {/* Columna: Todas las habilidades agrupadas por categoría */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-2">Todas las habilidades</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm h-[420px] flex flex-col">
            <div className="overflow-y-auto flex-1">
              {categorias.map((cat: any) => (
                <div key={cat?._id} className="mb-0">
                  <div className="bg-gray-200 border-b border-gray-500 px-3 py-2 font-semibold text-gray-800 text-base border-t border-l border-r border-gray-500">
                    {cat?.nombre}
                  </div>
                  <table className="min-w-full text-sm">
                    <tbody>
                      {(disponiblesPorCategoria[String(cat?._id)] || []).map((skill: any, idx: number, arr: any[]) => (
                        <tr key={skill?._id} className={idx < arr.length - 1 ? 'border-b border-gray-200' : ''}>
                          <td className="px-6 py-1 whitespace-nowrap text-gray-700">
                            <span className="pl-4 block">{skill?.tecnologia}</span>
                          </td>
                          <td className="px-3 py-1 text-right">
                            <button
                              onClick={() => handleAdd(String(skill?._id))}
                              disabled={selected.includes(String(skill?._id))}
                              className="text-green-600 hover:underline text-xs disabled:opacity-40 border border-green-200 rounded px-2 py-0.5 bg-green-50 hover:bg-green-100 transition"
                            >
                              Añadir a inicio
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!disponiblesPorCategoria[String(cat?._id)] || disponiblesPorCategoria[String(cat?._id)].length === 0) && (
                    <div className="text-xs text-gray-400 px-6 py-2 italic border-b border-gray-200">No hay habilidades para mostrar en esta categoría.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna: Habilidades destacadas agrupadas por categoría */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-2">Habilidades en inicio</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm h-[420px] flex flex-col">
            <div className="overflow-y-auto flex-1">
              {/* IDs inválidos */}
              {idsInvalidos.length > 0 && (
                <div className="mb-2 text-yellow-700 text-xs px-3 pt-2">
                  <span className="font-semibold">IDs inválidos en destacados:</span>
                  <ul className="list-disc ml-5">
                    {idsInvalidos.map(id => (
                      <li key={id} className="italic">[{id}] <button onClick={() => handleRemove(id)} className="text-red-600 hover:underline ml-2">Quitar</button></li>
                    ))}
                  </ul>
                </div>
              )}
              {Object.keys(destacadasPorCategoria).length === 0 && idsInvalidos.length === 0 ? (
                <div className="text-gray-500 px-3 py-2">No hay habilidades destacadas.</div>
              ) : (
                Object.entries(destacadasPorCategoria).map(([catId, skillsArr]) => (
                  <div key={catId} className="mb-0">
                    <div className="bg-gray-200 border-b border-gray-500 px-3 py-2 font-semibold text-gray-800 text-base border-t border-l border-r border-gray-500 rounded-t-md">
                      {categoriasById[catId]?.nombre || '[Sin categoría]'}
                    </div>
                    <table className="min-w-full text-sm">
                      <tbody>
                        {skillsArr.map((skill: any, idx: number, arr: any[]) => (
                          <tr key={skill?._id} className={idx < arr.length - 1 ? 'border-b border-gray-200' : ''}>
                            <td className="px-6 py-1 whitespace-nowrap text-gray-700">
                              <span className="pl-4 block">{skill?.tecnologia}</span>
                            </td>
                            <td className="px-3 py-1 text-right">
                              <button
                                onClick={() => handleRemove(String(skill?._id))}
                                className="text-red-600 hover:underline text-xs border border-red-200 rounded px-2 py-0.5 bg-red-50 hover:bg-red-100 transition"
                              >
                                Quitar de inicio
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          </div>
          {errorHome && <ErrorMessage message={errorHome} onDismiss={() => {}} />}
          {errorSkills && <ErrorMessage message={errorSkills} onDismiss={() => {}} />}
          {errorCategorias && <ErrorMessage message={errorCategorias} onDismiss={() => {}} />}
        </div>
      </div>
    </div>
  );
} 