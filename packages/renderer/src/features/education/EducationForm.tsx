import { useState } from "react";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextAreaField";
import TagInput from "../../components/ui/TagInput";
import FormSection from "../../components/ui/FormSection";

interface Link {
  titulo: string;
  url: string;
}

const estados = ["En curso", "Completado", "Abandonado"] as const;

type Estado = typeof estados[number];

export default function EducationForm() {
  // Estado del formulario
  const [titulo, setTitulo] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [estado, setEstado] = useState<Estado>("En curso");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aprendizajes, setAprendizajes] = useState<string[]>([]);
  const [aprendizajeInput, setAprendizajeInput] = useState("");
  const [certificadoUrl, setCertificadoUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [linkTitulo, setLinkTitulo] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Mock submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
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
    alert("Mock submit:\n" + JSON.stringify(data, null, 2));
  };

  // Métodos para aprendizajes
  const handleAddAprendizaje = (tag: string) => {
    if (!aprendizajes.includes(tag)) setAprendizajes([...aprendizajes, tag]);
  };
  const handleRemoveAprendizaje = (tag: string) => {
    setAprendizajes(aprendizajes.filter(a => a !== tag));
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormSection title="Información principal">
        <InputField label="Título*" value={titulo} onChange={e => setTitulo(e.target.value)} required />
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
          tags={aprendizajes}
          onAdd={handleAddAprendizaje}
          onRemove={handleRemoveAprendizaje}
          inputValue={aprendizajeInput}
          setInputValue={setAprendizajeInput}
          placeholder="Ej: React, Node.js, Scrum..."
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

      <div className="flex justify-end">
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">Guardar formación</button>
      </div>
    </form>
  );
} 