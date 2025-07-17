// packages/renderer/src/components/TopBar.tsx

type TopBarProps = {
  paginaActual: string;
  setPaginaActual: (pagina: string) => void;
};

const paginas = ["Inicio", "Resumen", "Habilidades", "Experiencia", "Proyectos", "Formación"];

export default function TopBar({ paginaActual, setPaginaActual }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md">
      <nav className="h-full flex items-center pl-72 pr-6">
        <div className="flex items-center space-x-6">
          {paginas.map((pagina) => (
            <button
              key={pagina}
              onClick={() => setPaginaActual(pagina)}
              className={`text-sm font-medium px-4 py-2 rounded-md transition duration-200 ease-in-out ${paginaActual === pagina
                  ? "bg-gray-700 text-white shadow-inner"
                  : "text-gray-300 hover:text-white"
                }`}
            >
              {pagina}
            </button>
          ))}
        </div>
      </nav>
    </header>


  );
}
