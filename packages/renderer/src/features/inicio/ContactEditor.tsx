import { useState } from "react";
import InputField from "../../components/ui/InputField";

interface Contacto {
  email: string;
  telefono: string;
  ubicacion: string;
  linkedin?: string;
  github?: string;
  portafolio?: string;
}

export default function ContactEditor() {
  const [contacto, setContacto] = useState<Contacto>({
    email: "",
    telefono: "",
    ubicacion: "",
    linkedin: "",
    github: "",
    portafolio: ""
  });

  const actualizarCampo = (
    campo: keyof Contacto,
    valor: string
  ) => {
    setContacto((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <form className="space-y-4">
      <InputField
        label="Correo electrónico"
        value={contacto.email}
        onChange={(e) => actualizarCampo("email", e.target.value)}
        placeholder="ejemplo@email.com"
      />
      <InputField
        label="Teléfono o WhatsApp"
        value={contacto.telefono}
        onChange={(e) => actualizarCampo("telefono", e.target.value)}
        placeholder="+56 9 ..."
      />
      <InputField
        label="Ubicación"
        value={contacto.ubicacion}
        onChange={(e) => actualizarCampo("ubicacion", e.target.value)}
        placeholder="Ej: Santiago, Chile"
      />
      <InputField
        label="LinkedIn"
        value={contacto.linkedin ?? ""}
        onChange={(e) => actualizarCampo("linkedin", e.target.value)}
        placeholder="https://linkedin.com/in/..."
      />
      <InputField
        label="GitHub"
        value={contacto.github ?? ""}
        onChange={(e) => actualizarCampo("github", e.target.value)}
        placeholder="https://github.com/..."
      />
      <InputField
        label="Portafolio personal"
        value={contacto.portafolio ?? ""}
        onChange={(e) => actualizarCampo("portafolio", e.target.value)}
        placeholder="https://miportafolio.com"
      />
    </form>
  );
}
