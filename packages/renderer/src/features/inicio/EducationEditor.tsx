import { useState } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";
import FormSection from "../../components/ui/FormSection";

interface Education {
    titulo: string;
    institucion: string;
    año: number | "";
    descripcion?: string;
    certificado?: string;
}

export default function EducationEditor() {
    const [educaciones, setEducaciones] = useState<Education[]>([]);

    const agregarEducacion = () => {
        setEducaciones((prev) => [
            ...prev,
            { titulo: "", institucion: "", año: "", descripcion: "", certificado: "" },
        ]);
    };

    const eliminarEducacion = (index: number) => {
        setEducaciones((prev) => prev.filter((_, i) => i !== index));
    };

    const actualizarCampo = (
        index: number,
        campo: keyof Education,
        valor: string | number
    ) => {
        setEducaciones((prev) => {
            const copia = [...prev];
            if (campo === "año") {
                const num = Number(valor);
                copia[index].año = isNaN(num) ? "" : num;
            } else {
                copia[index][campo] = valor as string;
            }

            return copia;
        });
    };

    return (
        <div className="space-y-6">
            <button
                onClick={agregarEducacion}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
                Agregar formación
            </button>

            {educaciones.map((edu, idx) => (
                <FormSection
                    key={idx}
                    title={`Formación #${idx + 1}`}
                    onDelete={() => eliminarEducacion(idx)}
                >
                    <InputField
                        label="Título o grado académico"
                        value={edu.titulo}
                        onChange={(e) => actualizarCampo(idx, "titulo", e.target.value)}
                    />

                    <InputField
                        label="Institución"
                        value={edu.institucion}
                        onChange={(e) => actualizarCampo(idx, "institucion", e.target.value)}
                    />

                    <InputField
                        label="Año"
                        value={edu.año}
                        onChange={(e) => actualizarCampo(idx, "año", e.target.value)}
                        placeholder="Ej: 2021"
                    />

                    <TextareaField
                        label="Descripción (opcional)"
                        value={edu.descripcion || ""}
                        onChange={(e) => actualizarCampo(idx, "descripcion", e.target.value)}
                        rows={3}
                        placeholder="Ej: Carrera técnica de 8 semestres..."
                    />

                    <InputField
                        label="Enlace al certificado (opcional)"
                        value={edu.certificado || ""}
                        onChange={(e) => actualizarCampo(idx, "certificado", e.target.value)}
                        placeholder="https://certificados.com/..."
                    />
                </FormSection>
            ))}
        </div>
    );
}
