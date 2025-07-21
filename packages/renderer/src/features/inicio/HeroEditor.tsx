import { useEffect, useState } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
}

export default function HeroEditor() {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    window.electronAPI.getHero().then((data) => {
      if (data) {
        setHero({
          title: data.titulo,
          subtitle: data.claim,
          description: data.claim || ''
        });
      }
    });
  }, []);

  if (!hero) return <div className="text-gray-500 italic">Cargando...</div>;

  return (
    <form className="space-y-6">
      <InputField
        label="Título"
        value={hero.title}
        onChange={() => {}}
      />
      <InputField
        label="Subtítulo"
        value={hero.subtitle}
        onChange={() => {}}
      />
      <TextareaField
        label="Descripción"
        value={hero.description}
        onChange={() => {}}
        rows={4}
      />
    </form>
  );
}
