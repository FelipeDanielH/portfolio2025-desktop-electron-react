import { useEffect, useState } from "react";

type SidebarProps = {
  paginaActual: string;
  seccionActual: string;
  setSeccionActual: (seccion: string) => void;
};

// 🔄 Actualizado según endpoints reales del backend
const seccionesPorPagina: Record<string, string[]> = {
  Inicio: [
    "Hero",
    "Sobre mí",
    "Habilidades",
    "Experiencia profesional",
    "Proyectos",
    "Formación",
    "Contacto",
    "Llamada a la acción"
  ],
  Resumen: [
    "Editar resumen"
  ],
  Habilidades: [
    "Gestionar Habilidades",
    "Gestionar Categorías"
  ],
  Experiencia: [
    "Gestionar Experiencia"
  ],
  Proyectos: [
    "Gestionar Proyectos",
    "Filtros"
  ],
  Formación: [
    "Gestionar Formación"
  ],
};

export default function Sidebar({ paginaActual, seccionActual, setSeccionActual }: SidebarProps) {
  const [secciones, setSecciones] = useState<string[]>([]);

  useEffect(() => {
    setSecciones(seccionesPorPagina[paginaActual] || []);
  }, [paginaActual]);

  return (
    <aside className="fixed top-14 left-0 w-64 h-[calc(100vh-56px)] bg-gray-800 text-gray-200 p-4 overflow-y-auto">
      <ul className="space-y-2">
        {secciones.map((name) => (
          <li key={name}>
            <button
              onClick={() => setSeccionActual(name)}
              className={`flex items-center w-full px-4 py-2 rounded-md transition ${
                seccionActual === name
                  ? "bg-gray-700 border-l-4 border-indigo-500 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
