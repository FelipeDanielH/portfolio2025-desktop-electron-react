import HeroEditor from "../features/inicio/HeroEditor";
import AboutEditor from "../features/inicio/AboutEditor";
import SkillsEditor from "../features/inicio/SkillsEditor";
import ExperienceEditor from "../features/inicio/ExperienceEditor";
import ProjectsEditor from "../features/inicio/ProjectsEditor";
import EducationEditor from "../features/inicio/EducationEditor";
import CertificationsEditor from "../features/inicio/CertificationsEditor";
import ContactEditor from "../features/inicio/ContactEditor";
import CallToActionEditor from "../features/inicio/CallToActionEditor";

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

  return (
    <p className="text-gray-500 italic">
      Esta página aún no tiene editores registrados.
    </p>
  );
}
