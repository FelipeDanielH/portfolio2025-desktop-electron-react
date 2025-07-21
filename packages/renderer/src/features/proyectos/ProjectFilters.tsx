import { useState } from "react";
import type { Tech } from "../../types/projects.types";
import { useTechs } from "../hooks/useTechs";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

interface CrudListProps {
  title: string;
  tipo: Tech["tipo"];
  items: Tech[];
  onAdd: (nombre: string) => void;
  onEdit: (id: string, nombre: string) => void;
  onDelete: (id: string) => void;
}

function CrudList({ title, tipo, items, onAdd, onEdit, onDelete }: CrudListProps) {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editandoNombre, setEditandoNombre] = useState("");

  const handleAdd = () => {
    if (nuevoNombre.trim()) {
      onAdd(nuevoNombre.trim());
      setNuevoNombre("");
    }
  };

  const handleEdit = (id: string) => {
    if (editandoId === id) {
      if (editandoNombre.trim()) {
        onEdit(id, editandoNombre.trim());
        setEditandoId(null);
        setEditandoNombre("");
      }
    } else {
      const item = items.find(i => i._id === id);
      if (item) {
        setEditandoId(id);
        setEditandoNombre(item.nombre);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setEditandoNombre("");
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      
      <div className="flex gap-2 mb-3">
        <input
          className="border p-2 rounded-md flex-1"
          placeholder={`Nuevo ${tipo}`}
          value={nuevoNombre}
          onChange={e => setNuevoNombre(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
        />
        <button
          className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
          onClick={handleAdd}
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-2">
        {items.map(item => (
          <li key={item._id} className="flex items-center justify-between border rounded-md p-2">
            {editandoId === item._id ? (
              <div className="flex gap-2 flex-1">
                <input
                  className="border p-1 rounded-md flex-1"
                  value={editandoNombre}
                  onChange={e => setEditandoNombre(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleEdit(item._id!)}
                />
                <button
                  className="text-green-600 hover:underline text-sm"
                  onClick={() => handleEdit(item._id!)}
                >
                  Guardar
                </button>
                <button
                  className="text-gray-500 hover:underline text-sm"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <span>{item.nombre}</span>
                <div className="flex gap-2">
                  <button
                    className="text-indigo-600 hover:underline text-sm"
                    onClick={() => handleEdit(item._id!)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => onDelete(item._id!)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectFilters() {
  const { techs, loading, error, create, update, delete: deleteTech, clearMessages } = useTechs();
  
  const tipos: Array<{ tipo: Tech["tipo"], label: string }> = [
    { tipo: "framework", label: "Frameworks" },
    { tipo: "lenguaje", label: "Lenguajes" },
    { tipo: "rol", label: "Roles" },
    { tipo: "herramienta", label: "Herramientas" }
  ];

  const handleAdd = (tipo: Tech["tipo"]) => async (nombre: string) => {
    try {
      await create({ tipo, nombre });
    } catch (error) {
      console.error('Error creating tech:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tecnología?')) {
      try {
        await deleteTech(id);
      } catch (error) {
        console.error('Error deleting tech:', error);
      }
    }
  };

  const handleEdit = async (id: string, nombre: string) => {
    try {
      await update(id, { nombre });
    } catch (error) {
      console.error('Error updating tech:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Filtros y tecnologías</h2>
        <LoadingSpinner text="Cargando tecnologías..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Filtros y tecnologías</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearMessages}
        />
      )}

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