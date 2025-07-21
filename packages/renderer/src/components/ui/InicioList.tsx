import React from 'react';

interface InicioListProps<T> {
  enInicio: T[];
  listaCompleta: T[];
  renderItem: (item: T) => React.ReactNode;
  onMandarAInicio: (item: T) => void;
  getKey: (item: T) => string | number;
  labelEnInicio?: string;
  labelRestantes?: string;
}

function InicioList<T>({
  enInicio,
  listaCompleta,
  renderItem,
  onMandarAInicio,
  getKey,
  labelEnInicio = 'En inicio',
  labelRestantes = 'Listado completo',
}: InicioListProps<T>) {
  // Filtrar los que no están en inicio
  const restantes = listaCompleta.filter(
    (item) => !enInicio.some((inicioItem) => getKey(inicioItem) === getKey(item))
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-semibold mb-2 text-green-700">{labelEnInicio}</h3>
        {enInicio.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay elementos en inicio.</p>
        ) : (
          <ul className="space-y-2">
            {enInicio.map((item) => (
              <li
                key={getKey(item)}
                className="flex items-center gap-2 bg-green-50 rounded px-3 py-2 border border-green-200"
              >
                <span className="text-green-600">✔</span>
                {renderItem(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">{labelRestantes}</h3>
        {restantes.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay más elementos para agregar.</p>
        ) : (
          <ul className="space-y-2">
            {restantes.map((item) => (
              <li
                key={getKey(item)}
                className="flex items-center gap-2 bg-white rounded px-3 py-2 border border-gray-200"
              >
                {renderItem(item)}
                <button
                  className="ml-auto px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  onClick={() => onMandarAInicio(item)}
                >
                  Mandar a inicio
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default InicioList; 