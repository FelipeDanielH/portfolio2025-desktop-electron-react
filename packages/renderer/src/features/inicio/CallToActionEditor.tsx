import { useState } from "react";
import InputField from "../../components/ui/InputField";

export default function CallToActionEditor() {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");

  return (
    <form className="space-y-6">
      <InputField
        label="Título principal"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="¿Listo para trabajar juntos?"
      />
      <InputField
        label="Subtítulo"
        value={subtitulo}
        onChange={(e) => setSubtitulo(e.target.value)}
        placeholder="Estoy disponible para nuevos proyectos y oportunidades"
      />
    </form>
  );
}
