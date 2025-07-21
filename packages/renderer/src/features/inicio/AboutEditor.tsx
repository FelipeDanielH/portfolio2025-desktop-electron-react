// packages/renderer/src/features/inicio/AboutEditor.tsx
import { useEffect, useState } from "react";
import TextareaField from "../../components/ui/TextAreaField";
import InputField from "../../components/ui/InputField";
import FormSection from "../../components/ui/FormSection";

interface AboutBlock {
  id?: string;
  titulo: string;
  descripcion: string;
  orden: number;
}

export default function AboutEditor() {
  const [bloques, setBloques] = useState<AboutBlock[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar bloques al iniciar
  useEffect(() => {
    cargarBloques();
    // eslint-disable-next-line
  }, []);

  const cargarBloques = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await window.electronAPI.about.getAll();
      if (Array.isArray(data)) {
        // Ordenar por 'orden' ascendente
        setBloques([...data].sort((a, b) => a.orden - b.orden));
      } else {
        setBloques([]);
      }
    } catch (e) {
      setError("Error al cargar los bloques de 'Sobre mí'");
    } finally {
      setCargando(false);
    }
  };

  const agregarBloque = async () => {
    setGuardando(true);
    setError(null);
    try {
      const nuevo = await window.electronAPI.about.create({
        titulo: "",
        descripcion: "",
        orden: bloques.length + 1,
      });
      if (nuevo) setBloques((prev) => [...prev, nuevo]);
    } catch (e) {
      setError("Error al agregar bloque");
    } finally {
      setGuardando(false);
    }
  };

  const actualizarBloque = async (index: number, campo: keyof AboutBlock, valor: string) => {
    const bloque = bloques[index];
    if (!bloque.id) return;
    const actualizado = { ...bloque, [campo]: valor };
    setBloques((prev) => prev.map((b, i) => (i === index ? actualizado : b)));
    try {
      await window.electronAPI.about.update(bloque.id, actualizado);
    } catch (e) {
      setError("Error al actualizar bloque");
    }
  };

  const eliminarBloque = async (index: number) => {
    const bloque = bloques[index];
    if (!bloque.id) return;
    setGuardando(true);
    setError(null);
    try {
      const ok = await window.electronAPI.about.delete(bloque.id);
      if (ok) {
        // Reordenar los bloques restantes
        const nuevos = bloques.filter((_, i) => i !== index).map((b, i) => ({ ...b, orden: i + 1 }));
        setBloques(nuevos);
        // Actualizar orden en backend
        for (const b of nuevos) {
          if (b.id) await window.electronAPI.about.update(b.id, { orden: b.orden });
        }
      }
    } catch (e) {
      setError("Error al eliminar bloque");
    } finally {
      setGuardando(false);
    }
  };

  const moverBloque = async (index: number, direccion: "arriba" | "abajo") => {
    const nuevoIndex = direccion === "arriba" ? index - 1 : index + 1;
    if (nuevoIndex < 0 || nuevoIndex >= bloques.length) return;
    const copia = [...bloques];
    [copia[index], copia[nuevoIndex]] = [copia[nuevoIndex], copia[index]];
    // Actualizar orden local
    copia.forEach((b, i) => (b.orden = i + 1));
    setBloques([...copia]);
    // Actualizar orden en backend
    setGuardando(true);
    setError(null);
    try {
      for (const b of copia) {
        if (b.id) await window.electronAPI.about.update(b.id, { orden: b.orden });
      }
    } catch (e) {
      setError("Error al reordenar bloques");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="flex justify-center items-center py-8"><div className="text-gray-500">Cargando bloques de "Sobre mí"...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Bloques "Sobre mí"</h2>
        <button
          onClick={agregarBloque}
          disabled={guardando}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Agregar Bloque
        </button>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">{error}</div>}
      {bloques.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay bloques de "Sobre mí". Haz clic en "Agregar Bloque" para comenzar.</div>
      ) : (
        <div className="space-y-4">
          {bloques.map((bloque, index) => (
            <FormSection
              key={bloque.id || index}
              title={`Bloque ${index + 1}${bloque.titulo ? ` - ${bloque.titulo}` : ''}`}
              onDelete={() => eliminarBloque(index)}
              className="relative"
            >
              {/* Botones de reordenamiento */}
              <div className="absolute top-4 right-16 flex gap-1">
                <button
                  onClick={() => moverBloque(index, 'arriba')}
                  disabled={index === 0 || guardando}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Mover hacia arriba"
                >↑</button>
                <button
                  onClick={() => moverBloque(index, 'abajo')}
                  disabled={index === bloques.length - 1 || guardando}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Mover hacia abajo"
                >↓</button>
              </div>
              <InputField
                label="Título"
                value={bloque.titulo}
                onChange={e => actualizarBloque(index, 'titulo', e.target.value)}
                placeholder="Ej: Pasión por la tecnología"
              />
              <TextareaField
                label="Descripción"
                value={bloque.descripcion}
                onChange={e => actualizarBloque(index, 'descripcion', e.target.value)}
                placeholder="Texto libre descriptivo"
                rows={4}
              />
            </FormSection>
          ))}
        </div>
      )}
    </div>
  );
}
