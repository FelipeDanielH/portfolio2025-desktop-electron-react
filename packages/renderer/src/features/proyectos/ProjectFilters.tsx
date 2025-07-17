import { useState } from "react";

interface Tech {
  _id: string;
  tipo: "lenguaje" | "framework" | "rol" | "herramienta";
  nombre: string;
  icono?: string;
}

const mockTechs: Tech[] = [
  { _id: "1", tipo: "framework", nombre: "React" },
  { _id: "2", tipo: "framework", nombre: "Vue" },
  { _id: "3", tipo: "lenguaje", nombre: "JavaScript" },
  { _id: "4", tipo: "lenguaje", nombre: "TypeScript" },
  { _id: "5", tipo: "rol", nombre: "Frontend" },
  { _id: "6", tipo: "herramienta", nombre: "Docker" }
];

function CrudList({ title, tipo, items, onAdd, onEdit, onDelete }: {
  title: string,
  tipo: Tech["tipo"],
  items: Tech[],
  onAdd: (nombre: string) => void,
  onEdit: (id: string, nombre: string) => void,
  onDelete: (id: string) => void
}) {
  const [nuevo, setNuevo] = useState("");
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex gap-2 mb-2">
        <input className="border p-2 rounded-md flex-1" value={nuevo} onChange={e => setNuevo(e.target.value)} placeholder={`Agregar ${title.toLowerCase()}`} />
        <button type="button" className="bg-green-600 text-white px-3 rounded-md" onClick={() => { if (nuevo.trim()) { onAdd(nuevo.trim()); setNuevo(""); } }}>Agregar</button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item._id} className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
            {item.nombre}
            <button className="text-red-500 ml-1" onClick={() => onDelete(item._id)}>&times;</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectFilters() {
  const [techs, setTechs] = useState<Tech[]>(mockTechs);
  const tipos: Array<{ tipo: Tech["tipo"], label: string }> = [
    { tipo: "framework", label: "Frameworks" },
    { tipo: "lenguaje", label: "Lenguajes" },
    { tipo: "rol", label: "Roles" },
    { tipo: "herramienta", label: "Herramientas" }
  ];

  const handleAdd = (tipo: Tech["tipo"]) => (nombre: string) => {
    setTechs(prev => ([...prev, { _id: Date.now().toString(36) + Math.random().toString(36).slice(2), tipo, nombre }]));
  };
  const handleDelete = (id: string) => {
    setTechs(prev => prev.filter(t => t._id !== id));
  };
  const handleEdit = (id: string, nombre: string) => {
    setTechs(prev => prev.map(t => t._id === id ? { ...t, nombre } : t));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Filtros y tecnologías</h2>
      {tipos.map(({ tipo, label }) => (
        <CrudList
          key={tipo}
          title={label}
          tipo={tipo}
          items={techs.filter(t => t.tipo === tipo)}
          onAdd={handleAdd(tipo)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
} 