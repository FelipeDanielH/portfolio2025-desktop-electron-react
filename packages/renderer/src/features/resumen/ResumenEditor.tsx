import { useState, useEffect } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";
import FormSection from "../../components/ui/FormSection";
import useResumen from "../hooks/useResumen";

interface BloqueResumen {
  id?: string;
  titulo: string;
  contenido: string;
  orden: number;
}

export default function ResumenEditor() {
  const {
    bloques,
    cargando,
    guardando,
    error,
    agregarBloque,
    actualizarBloque,
    eliminarBloque,
    moverBloque,
    guardarBloques
  } = useResumen();

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Cargando bloques de resumen...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Bloques de Resumen</h2>
        <div className="flex gap-2">
          <button
            onClick={agregarBloque}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Agregar Bloque
          </button>
          <button
            onClick={guardarBloques}
            disabled={guardando}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Los bloques se mostrarán en orden en la sección "Sobre Mí" del portfolio. 
          Puedes reordenarlos usando los botones de flecha o agregar/eliminar bloques según necesites.
        </p>
      </div>

      {/* Lista de bloques */}
      {bloques.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay bloques de resumen. Haz clic en "Agregar Bloque" para comenzar.
        </div>
      ) : (
        <div className="space-y-4">
          {bloques.map((bloque: BloqueResumen, index: number) => (
            <FormSection
              key={index}
              title={`Bloque ${index + 1}${bloque.titulo ? ` - ${bloque.titulo}` : ''}`}
              onDelete={() => eliminarBloque(index)}
              className="relative"
            >
              {/* Botones de reordenamiento */}
              <div className="absolute top-4 right-16 flex gap-1">
                <button
                  onClick={() => moverBloque(index, 'arriba')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Mover hacia arriba"
                >
                  ↑
                </button>
                <button
                  onClick={() => moverBloque(index, 'abajo')}
                  disabled={index === bloques.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  title="Mover hacia abajo"
                >
                  ↓
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <InputField
                      label="Título del bloque (opcional)"
                      value={bloque.titulo}
                      onChange={(e) => actualizarBloque(index, "titulo", e.target.value)}
                      placeholder="Ej: Mi experiencia, Objetivos profesionales, etc."
                    />
                  </div>
                  <div>
                    <InputField
                      label="Orden"
                      type="number"
                      value={bloque.orden}
                      onChange={(e) => actualizarBloque(index, "orden", parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>

                <TextareaField
                  label="Contenido del bloque"
                  value={bloque.contenido}
                  onChange={(e) => actualizarBloque(index, "contenido", e.target.value)}
                  placeholder="Escribe el contenido de este bloque de tu resumen profesional..."
                  rows={6}
                />

                {/* Contador de caracteres */}
                <div className="text-sm text-gray-500 text-right">
                  {bloque.contenido.length} caracteres
                </div>
              </div>
            </FormSection>
          ))}
        </div>
      )}

      {/* Resumen de estadísticas */}
      {bloques.length > 0 && (
        <div className="bg-gray-50 border rounded-md p-4">
          <h3 className="font-medium mb-2">Resumen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Total de bloques:</strong> {bloques.length}
            </div>
            <div>
              <strong>Caracteres totales:</strong> {bloques.reduce((total: number, bloque: BloqueResumen) => total + bloque.contenido.length, 0)}
            </div>
            <div>
              <strong>Bloques con título:</strong> {bloques.filter((b: BloqueResumen) => b.titulo.trim()).length}
            </div>
            <div>
              <strong>Bloques completos:</strong> {bloques.filter((b: BloqueResumen) => b.contenido.trim()).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}