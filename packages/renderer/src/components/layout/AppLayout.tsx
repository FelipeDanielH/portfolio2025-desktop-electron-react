import { useState } from "react";
import TopBar from "../TopBar";
import Sidebar from "../Sidebar";
import EditorRouter from "../EditorRouter";

export default function AppLayout() {
  const [paginaActual, setPaginaActual] = useState("Inicio");
  const [seccionActual, setSeccionActual] = useState("Hero");

  // Sincronizar seccionActual con paginaActual
  const handleSetPaginaActual = (pagina: string) => {
    setPaginaActual(pagina);
    if (pagina === "Inicio") {
      setSeccionActual("Hero");
    } else if (pagina === "Resumen") {
      setSeccionActual("Editar resumen");
    } else if (pagina === "Habilidades") {
      setSeccionActual("Editar habilidades");
    } else {
      setSeccionActual("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar paginaActual={paginaActual} setPaginaActual={handleSetPaginaActual} />

      <div className="flex">
        <Sidebar
          paginaActual={paginaActual}
          seccionActual={seccionActual}
          setSeccionActual={setSeccionActual}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-8 pl-72 mt-14">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
            <h1 className="text-2xl font-bold">{paginaActual}</h1>
            <h2 className="text-lg text-gray-600">{seccionActual}</h2>

            {/* Render dinámico centralizado */}
            <EditorRouter
              paginaActual={paginaActual}
              seccionActual={seccionActual}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
