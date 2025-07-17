import { useState } from "react";

interface Experience {
  _id?: string;
  rol: string;
  empresa: string;
  ubicacion: string;
  modalidad?: "Remoto" | "Presencial" | "Híbrido";
  equipo?: string;
  sector?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion: string;
  responsabilidades?: string[];
  logros?: string[];
  tecnologias?: string[];
  orden: number;
}

export default function ExperienceList() {
  const [experiencias, setExperiencias] = useState<Experience[]>([]); // Aquí luego se cargará desde el backend

  // Simulación de datos
  // ...

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Experiencia profesional</h2>
      {experiencias.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">No hay experiencias registradas.</div>
      ) : (
        <div className="space-y-4">
          {experiencias.map((exp, idx) => (
            <div key={exp._id ?? idx} className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">{exp.rol}</div>
                  <div className="text-sm text-gray-600">{exp.empresa} - {exp.ubicacion}</div>
                  <div className="text-xs text-gray-400">{exp.fecha_inicio} - {exp.fecha_fin || 'Actualidad'}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-indigo-600 hover:underline text-sm">Editar</button>
                  <button className="text-red-500 hover:underline text-sm">Eliminar</button>
                </div>
              </div>
              <div className="mt-2 text-sm">{exp.descripcion}</div>
              {exp.tecnologias && exp.tecnologias.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">Stack: {exp.tecnologias.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 