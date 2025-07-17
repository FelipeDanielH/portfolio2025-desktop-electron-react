import HeroEditor from "../features/inicio/HeroEditor";
import AboutEditor from "../features/inicio/AboutEditor";
import SkillsEditor from "../features/inicio/SkillsEditor";
import CategoriesEditor from "../features/habilidades/CategoriesEditor";
import ExperienceEditor from "../features/inicio/ExperienceEditor";
import ProjectsEditor from "../features/inicio/ProjectsEditor";
import EducationEditor from "../features/inicio/EducationEditor";
import CertificationsEditor from "../features/inicio/CertificationsEditor";
import ContactEditor from "../features/inicio/ContactEditor";
import CallToActionEditor from "../features/inicio/CallToActionEditor";

import ResumenEditor from "../features/resumen/ResumenEditor";
import ExperienceList from "../features/experiencia/ExperienceList";
import ExperienceForm from "../features/experiencia/ExperienceForm";
import ProjectFilters from "../features/proyectos/ProjectFilters";
import ProjectList from "../features/proyectos/ProjectList";
import ProjectForm from "../features/proyectos/ProjectForm";
import EducationForm from "../features/education/EducationForm";
import EducationList from "../features/education/EducationList";


type Props = {
  paginaActual: string;
  seccionActual: string;
};

export default function EditorRouter({ paginaActual, seccionActual }: Props) {
  if (paginaActual === "Inicio") {
    switch (seccionActual) {
      case "Hero":
        return <HeroEditor />;
      case "Sobre mí":
        return <AboutEditor />;
      case "Habilidades técnicas":
        return <SkillsEditor />;
      case "Experiencia profesional":
        return <ExperienceEditor />;
      case "Proyectos":
        return <ProjectsEditor />;
      case "Formación académica":
        return <EducationEditor />;
      case "Certificaciones":
        return <CertificationsEditor />;
      case "Contacto":
        return <ContactEditor />;
      case "Llamado a la acción":
        return <CallToActionEditor />;
      default:
        return (
          <p className="text-gray-500 italic">
            Esta sección aún no tiene editor implementado.
          </p>
        );
    }
  }
  if (paginaActual === "Habilidades" && seccionActual === "Agregar tecnología") {
    return <SkillsEditor />;
  }
  if (paginaActual === "Habilidades" && seccionActual === "Categorías") {
    return <CategoriesEditor />;
  }
  if (paginaActual === "Resumen" && seccionActual === "Editar resumen") {
    return <ResumenEditor />;
  }
  if (paginaActual === "Experiencia" && seccionActual === "Listar experiencias") {
    return <ExperienceList />;
  }
  if (paginaActual === "Experiencia" && seccionActual === "Agregar experiencia") {
    return <ExperienceForm mode="crear" />;
  }
  if (paginaActual === "Proyectos" && seccionActual === "Filtros") {
    return <ProjectFilters />;
  }
  if (paginaActual === "Proyectos" && seccionActual === "Listado proyectos") {
    return <ProjectList />;
  }
  if (paginaActual === "Proyectos" && seccionActual === "Agregar proyecto") {
    return <ProjectForm mode="crear" />;
  }
  if (paginaActual === "Formación" && seccionActual === "Agregar formación") {
    return <EducationForm />;
  }
  if (paginaActual === "Formación" && seccionActual === "Listado de formaciones") {
    return <EducationList />;
  }
  return (
    <p className="text-gray-500 italic">
      Esta página aún no tiene editores registrados.
    </p>
  );
}
