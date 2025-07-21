import React, { useCallback } from 'react';
import { useSkills } from '../hooks/useSkills';
import { useHomeSkills } from '../hooks/useHomeSkills';
import InicioList from '../../components/ui/InicioList';
import type { Skill } from '../../types/skills.types';

const getCategoriaName = (categorias: { _id: string; nombre: string }[] | any[], categoriaId: string) => {
  const cat = categorias.find((c) => c._id === categoriaId);
  return cat ? cat.nombre : 'Sin categoría';
};

const SkillInfoCard: React.FC<{ skill: Skill; categoria: string }> = ({ skill, categoria }) => (
  <div className="flex flex-col gap-1 w-full">
    <div className="flex items-center gap-2">
      <span className="font-semibold text-base text-gray-900">{skill.tecnologia}</span>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
        skill.nivel === 'Experto' ? 'bg-purple-100 text-purple-800' :
        skill.nivel === 'Avanzado' ? 'bg-blue-100 text-blue-800' :
        skill.nivel === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {skill.nivel}
      </span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-gray-500">Categoría:</span>
      <span className="font-medium">{categoria}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="text-gray-500">Puntuación:</span>
      <div className="w-20 bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(skill.puntuacion / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700">{skill.puntuacion}/10</span>
    </div>
    {skill.descripcion && (
      <div className="text-gray-500 text-xs truncate">{skill.descripcion}</div>
    )}
    {skill.conceptos && skill.conceptos.length > 0 && (
      <div className="text-xs text-gray-500">
        Conceptos: {skill.conceptos.map((c) => c.nombre).join(', ')}
      </div>
    )}
  </div>
);

const SkillsInicioList: React.FC = () => {
  const { skills, categorias, loading: loadingSkills } = useSkills();
  const { homeSkills, loading: loadingHome, update } = useHomeSkills();

  const destacados = homeSkills?.skills
    ? homeSkills.skills
        .map((id) => skills.find((s) => s._id === id))
        .filter((s): s is Skill => !!s)
    : [];

  const handleMandarAInicio = useCallback(
    (skill: Skill) => {
      if (!homeSkills) return;
      // Añadir el skill al final del array de destacados
      const nuevos = [...homeSkills.skills, skill._id!];
      update({ skills: nuevos });
    },
    [homeSkills, update]
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Habilidades técnicas</h2>
      <InicioList
        enInicio={destacados}
        listaCompleta={skills}
        getKey={(s) => s._id!}
        renderItem={(skill) => (
          <SkillInfoCard
            skill={skill}
            categoria={getCategoriaName(categorias, skill.categoria_id)}
          />
        )}
        onMandarAInicio={handleMandarAInicio}
        labelEnInicio="En inicio"
        labelRestantes="Listado completo"
      />
      {(loadingSkills || loadingHome) && (
        <div className="text-center text-gray-400 mt-4">Cargando...</div>
      )}
    </div>
  );
};

export default SkillsInicioList; 