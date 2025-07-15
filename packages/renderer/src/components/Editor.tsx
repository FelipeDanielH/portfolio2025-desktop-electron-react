import { formulariosMock } from "../data/formularioMock";

type EditorProps = {
  paginaActual: string;
  seccionActual: string;
};

export default function Editor({ seccionActual }: EditorProps) {
  const definicion = formulariosMock[seccionActual];

  if (!definicion) {
    return (
      <p className="text-gray-500 italic">
        No hay campos definidos para esta sección.
      </p>
    );
  }

  if (definicion.tipo === "singleton") {
    return (
      <form className="space-y-6">
        {definicion.campos.map((campo, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-md shadow-sm border border-gray-200"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {campo.label}
            </label>
            {campo.tipo === "texto" ? (
              <input
                type="text"
                name={campo.name}
                placeholder={campo.placeholder}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <textarea
                name={campo.name}
                rows={4}
                placeholder={campo.placeholder}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          </div>
        ))}
      </form>
    );
  }

  return (
    <p className="text-red-600 font-semibold">
      Esta sección es de tipo "lista", aún no implementado.
    </p>
  );
}
