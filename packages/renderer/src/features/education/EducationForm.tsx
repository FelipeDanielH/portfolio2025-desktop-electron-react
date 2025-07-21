import { useState } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";
import TagInput from "../../components/ui/TagInput";
import FormSection from "../../components/ui/FormSection";
import { useEducation } from "../hooks/useEducation";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import type { Education, EducationFormData } from "../../types/education.types";

interface Link {
  titulo: string;
  url: string;
}

const tipos = [
  { value: "formacion", label: "Formación académica" },
  { value: "certificacion", label: "Certificación" }
] as const;

type Tipo = typeof tipos[number]["value"];
const estados = ["En curso", "Completado", "Abandonado"] as const;
type Estado = typeof estados[number];

interface Props {
  mode: "crear" | "editar";
  initialData?: Education;
  onSubmit: (data: EducationFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EducationForm({ mode, initialData, onSubmit, onCancel, loading }: Props) {
  const { loading: educationLoading, error: educationError, clearMessages: clearEducationMessages } = useEducation();
  
  // Estado del formulario
  const [tipo, setTipo] = useState<Tipo>(initialData?.tipo || "formacion");
  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [institucion, setInstitucion] = useState(initialData?.institucion || "");
  const [estado, setEstado] = useState<Estado>(initialData?.estado || "En curso");
  const [fechaInicio, setFechaInicio] = useState(initialData?.fecha_inicio || "");
  const [fechaFin, setFechaFin] = useState(initialData?.fecha_fin || "");
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [aprendizajes, setAprendizajes] = useState<string[]>(initialData?.aprendizajes || []);
  const [certificadoUrl, setCertificadoUrl] = useState(initialData?.certificado_url || "");
  const [links, setLinks] = useState<Link[]>(initialData?.links_relevantes || []);
  const [linkTitulo, setLinkTitulo] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Validación
  const isValid = titulo && institucion && fechaInicio;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    const data: EducationFormData = {
      tipo,
      titulo,
      institucion,
      estado,
      fecha_inicio: fechaInicio,
      fecha_fin: estado === "En curso" ? null : fechaFin,
      descripcion,
      aprendizajes,
      certificado_url: certificadoUrl || null,
      links_relevantes: links
    };

    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting education:', error);
    }
  };

  // Métodos para links
  const handleAddLink = () => {
    if (linkTitulo.trim() && linkUrl.trim()) {
      setLinks([...links, { titulo: linkTitulo, url: linkUrl }]);
      setLinkTitulo("");
      setLinkUrl("");
    }
  };
  const handleRemoveLink = (i: number) => {
    setLinks(links.filter((_, idx) => idx !== i));
  };

  const isLoading = loading || educationLoading;
  const error = educationError;

  if (isLoading) {
    return <LoadingSpinner text="Cargando..." />;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold">{mode === "crear" ? "Agregar formación" : "Editar formación"}</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearEducationMessages}
        />
      )}
      
      <FormSection title="Información principal">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1">Tipo*</label>
            <select className="w-full border rounded-md p-2" value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
              {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <InputField label="Título*" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>
        </div>
        <InputField label="Institución*" value={institucion} onChange={e => setInstitucion(e.target.value)} required />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1">Estado*</label>
            <select className="w-full border rounded-md p-2" value={estado} onChange={e => setEstado(e.target.value as Estado)}>
              {estados.map(est => <option key={est} value={est}>{est}</option>)}
            </select>
          </div>
          <div>
            <InputField label="Fecha inicio*" type="month" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required />
          </div>
          <div>
            <InputField label="Fecha fin" type="month" value={fechaFin} onChange={e => setFechaFin(e.target.value)} disabled={estado === "En curso"} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Descripción">
        <TextareaField label="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={4} />
      </FormSection>

      <FormSection title="Aprendizajes clave">
        <TagInput
          label="Aprendizajes"
          value={aprendizajes}
          onChange={setAprendizajes}
          suggestions={[]}
          placeholder="Ej: React, Node.js, Scrum..."
          maxTags={10}
        />
      </FormSection>

      <FormSection title="Certificado (opcional)">
        <InputField label="URL del certificado" value={certificadoUrl} onChange={e => setCertificadoUrl(e.target.value)} placeholder="https://..." />
        {certificadoUrl && (
          <div className="mt-2">
            <a href={certificadoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver certificado</a>
            <div className="mt-2">
              <img src={certificadoUrl} alt="Certificado" className="max-h-48 rounded-md border" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Links relevantes">
        <div className="flex gap-2 mb-2">
          <InputField label="Título" value={linkTitulo} onChange={e => setLinkTitulo(e.target.value)} />
          <InputField label="URL" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />
          <button type="button" onClick={handleAddLink} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Agregar</button>
        </div>
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="font-medium">{l.titulo}:</span>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{l.url}</a>
              <button type="button" onClick={() => handleRemoveLink(i)} className="text-red-500 hover:underline">Eliminar</button>
            </li>
          ))}
        </ul>
      </FormSection>

      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400" 
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Guardando..." : (mode === "crear" ? "Guardar formación" : "Guardar cambios")}
        </button>
      </div>
    </form>
  );
} 