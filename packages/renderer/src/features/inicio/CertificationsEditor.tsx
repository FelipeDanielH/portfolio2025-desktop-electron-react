import { useState } from "react";
import InputField from "../../components/ui/InputField";
import FormSection from "../../components/ui/FormSection";

interface Certificacion {
  nombre: string;
  entidad: string;
  año: number | "";
  url?: string;
}

export default function CertificationsEditor() {
  const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);

  const agregarCertificacion = () => {
    setCertificaciones((prev) => [
      ...prev,
      { nombre: "", entidad: "", año: "", url: "" },
    ]);
  };

  const eliminarCertificacion = (index: number) => {
    setCertificaciones((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarCampo = (
    index: number,
    campo: keyof Certificacion,
    valor: string
  ) => {
    setCertificaciones((prev) => {
      const copia = [...prev];

      if (campo === "año") {
        const num = Number(valor);
        copia[index].año = isNaN(num) ? "" : num;
      } else {
        copia[index][campo] = valor;
      }

      return copia;
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={agregarCertificacion}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Agregar certificación
      </button>

      {certificaciones.map((cert, idx) => (
        <FormSection
          key={idx}
          title={`Certificación #${idx + 1}`}
          onDelete={() => eliminarCertificacion(idx)}
        >
          <InputField
            label="Nombre del curso o certificación"
            value={cert.nombre}
            onChange={(e) => actualizarCampo(idx, "nombre", e.target.value)}
          />
          <InputField
            label="Entidad emisora"
            value={cert.entidad}
            onChange={(e) => actualizarCampo(idx, "entidad", e.target.value)}
          />
          <InputField
            label="Año"
            value={cert.año}
            onChange={(e) => actualizarCampo(idx, "año", e.target.value)}
            placeholder="Ej: 2023"
          />
          <InputField
            label="Link al certificado (opcional)"
            value={cert.url ?? ""}
            onChange={(e) => actualizarCampo(idx, "url", e.target.value)}
            placeholder="https://...certificado"
          />
        </FormSection>
      ))}
    </div>
  );
}
