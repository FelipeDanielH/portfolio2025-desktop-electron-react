import { useState } from "react";
import InputField from "../../components/ui/InputField";

interface Categoria {
  id?: string;
  nombre: string;
  orden: number;
}

export default function CategoriesEditor() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const agregarCategoria = () => {
    setCategorias(prev => ([
      ...prev,
      { nombre: "", orden: prev.length + 1 }
    ]));
  };

  const actualizarCategoria = (idx: number, campo: keyof Categoria, valor: string | number) => {
    setCategorias(prev => {
      const copia = [...prev];
      (copia[idx][campo] as any) = valor;
      return copia;
    });
  };

  const eliminarCategoria = (idx: number) => {
    setCategorias(prev => prev.filter((_, i) => i !== idx).map((cat, i) => ({ ...cat, orden: i + 1 })));
  };

  const moverCategoria = (idx: number, direccion: 'arriba' | 'abajo') => {
    setCategorias(prev => {
      const copia = [...prev];
      const nuevoIdx = direccion === 'arriba' ? idx - 1 : idx + 1;
      if (nuevoIdx >= 0 && nuevoIdx < copia.length) {
        [copia[idx], copia[nuevoIdx]] = [copia[nuevoIdx], copia[idx]];
        copia[idx].orden = idx + 1;
        copia[nuevoIdx].orden = nuevoIdx + 1;
      }
      return copia;
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={agregarCategoria}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Agregar categoría
      </button>
      {categorias.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay categorías registradas.
        </div>
      )}
      {categorias.map((cat, idx) => (
        <div key={idx} className="border p-4 rounded-md bg-gray-50 flex items-center gap-4">
          <InputField
            label="Nombre"
            value={cat.nombre}
            onChange={e => actualizarCategoria(idx, "nombre", e.target.value)}
            placeholder="Ej: Frontend"
          />
          <InputField
            label="Orden"
            type="number"
            min={1}
            value={cat.orden}
            onChange={e => actualizarCategoria(idx, "orden", Number(e.target.value))}
          />
          <button
            onClick={() => moverCategoria(idx, 'arriba')}
            disabled={idx === 0}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            title="Mover hacia arriba"
          >↑</button>
          <button
            onClick={() => moverCategoria(idx, 'abajo')}
            disabled={idx === categorias.length - 1}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            title="Mover hacia abajo"
          >↓</button>
          <button
            onClick={() => eliminarCategoria(idx)}
            className="text-red-500 hover:underline text-sm"
          >Eliminar</button>
        </div>
      ))}
    </div>
  );
} 