import HeroInicioEditor from "../features/inicio/HeroInicioEditor";
import AboutInicioList from "../features/inicio/AboutInicioList";
import SkillsInicioList from "../features/inicio/SkillsInicioList";
import ExperienceInicioList from "../features/inicio/ExperienceInicioList";
import ProjectsInicioList from "../features/inicio/ProjectsInicioList";
import EducationInicioList from "../features/inicio/EducationInicioList";
import ContactInicioEditor from "../features/inicio/ContactInicioEditor";
import CallToActionInicioEditor from "../features/inicio/CallToActionInicioEditor";

import { ResumenEditor } from "../features/resumen/ResumenEditor";
import { ExperienceEditor } from "../features/experiencia/ExperienceEditor";
import ProjectFilters from "../features/proyectos/ProjectFilters";
import ProjectEditor from "../features/proyectos/ProjectEditor";
import { EducationEditor } from "../features/education/EducationEditor";
import SkillsList from "../features/habilidades/SkillsList";
import CategoriesEditor from "../features/habilidades/CategoriesEditor";

type Props = {
  paginaActual: string;
  seccionActual: string;
};

export default function EditorRouter({ paginaActual, seccionActual }: Props) {
  if (paginaActual === "Inicio") {
    switch (seccionActual) {
      case "Hero":
        return <HeroInicioEditor />;
      case "Sobre mí":
        return <AboutInicioList />;
      case "Habilidades":
        return <SkillsInicioList />;
      case "Experiencia profesional":
        return <ExperienceInicioList />;
      case "Proyectos":
        return <ProjectsInicioList />;
      case "Formación":
        return <EducationInicioList />;
      case "Contacto":
        return <ContactInicioEditor />;
      case "Llamada a la acción":
        return <CallToActionInicioEditor />;
      default:
        return (
          <p className="text-gray-500 italic">
            Esta sección aún no tiene editor implementado.
          </p>
        );
    }
  }
  if (paginaActual === "Habilidades") {
    switch (seccionActual) {
      case "Gestionar Habilidades":
        return <SkillsList />;
      case "Gestionar Categorías":
        return <CategoriesEditor />;
      default:
        return (
          <p className="text-gray-500 italic">
            Esta sección aún no tiene editor implementado.
          </p>
        );
    }
  }
  if (paginaActual === "Resumen" && seccionActual === "Editar resumen") {
    return <ResumenEditor />;
  }
  if (paginaActual === "Experiencia" && seccionActual === "Gestionar Experiencia") {
    return <ExperienceEditor />;
  }
  if (paginaActual === "Proyectos" && seccionActual === "Filtros") {
    return <ProjectFilters />;
  }
  if (paginaActual === "Proyectos" && seccionActual === "Gestionar Proyectos") {
    return <ProjectEditor />;
  }
  if (paginaActual === "Formación" && seccionActual === "Gestionar Formación") {
    return <EducationEditor />;
  }
  return (
    <p className="text-gray-500 italic">
      Esta página aún no tiene editores registrados.
    </p>
  );
}
