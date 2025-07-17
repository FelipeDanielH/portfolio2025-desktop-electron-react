import { useState } from "react";
import FormSection from "../../components/ui/FormSection";

const initialEducations = [
  {
    _id: "1",
    titulo: "Desarrollo Web Full Stack",
    institucion: "Universidad del Desarrollo",
    estado: "En curso",
    fecha_inicio: "2023-11",
    fecha_fin: "2024-08",
    descripcion: "Programa intensivo enfocado en el desarrollo frontend y backend con proyectos reales.",
    aprendizajes: [
      "Programación con JavaScript y TypeScript",
      "Frameworks modernos como React y Node.js",
      "Metodologías ágiles y trabajo colaborativo",
      "Despliegue continuo en Vercel y Firebase"
    ],
    certificado_url: null,
    links_relevantes: [
      {
        titulo: "Proyecto final",
        url: "https://portafolio-front-tau.vercel.app"
      }
    ]
  },
  {
    _id: "2",
    titulo: "Certificación Scrum Master",
    institucion: "Scrum.org",
    estado: "Completado",
    fecha_inicio: "2022-01",
    fecha_fin: "2022-03",
    descripcion: "Certificación internacional en metodologías ágiles Scrum.",
    aprendizajes: ["Scrum", "Gestión de equipos", "Sprints", "Product Owner"],
    certificado_url: "https://certificados.com/scrum-master.png",
    links_relevantes: []
  }
];

export default function EducationList() {
  const [educations, setEducations] = useState(initialEducations);

  const handleDelete = (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar esta formación?")) {
      setEducations(educations.filter(e => e._id !== id));
    }
  };

  const handleEdit = (id: string) => {
    alert("Funcionalidad mock: aquí se abriría el formulario de edición para la formación con id " + id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Formación académica y certificaciones</h2>
      {educations.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">No hay formaciones registradas.</div>
      ) : (
        educations.map(edu => (
          <FormSection key={edu._id} title={edu.titulo}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">Institución:</span> {edu.institucion}<br/>
                <span className="font-semibold">Estado:</span> {edu.estado}<br/>
                <span className="font-semibold">Fechas:</span> {edu.fecha_inicio} - {edu.estado === "En curso" ? "Actualidad" : edu.fecha_fin}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(edu._id)} className="text-indigo-600 hover:underline text-sm">Editar</button>
                <button onClick={() => handleDelete(edu._id)} className="text-red-500 hover:underline text-sm">Eliminar</button>
              </div>
            </div>
            {edu.descripcion && <div className="mb-2 text-gray-600">{edu.descripcion}</div>}
            {edu.aprendizajes && edu.aprendizajes.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Aprendizajes clave:</span>
                <ul className="list-disc list-inside ml-4">
                  {edu.aprendizajes.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
            {edu.links_relevantes && edu.links_relevantes.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Links relevantes:</span>
                <ul className="list-disc list-inside ml-4">
                  {edu.links_relevantes.map((l, i) => (
                    <li key={i}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{l.titulo}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {edu.certificado_url && (
              <div className="mt-2">
                <a href={edu.certificado_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver certificado</a>
                <div className="mt-2">
                  <img src={edu.certificado_url} alt="Certificado" className="max-h-48 rounded-md border" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>
            )}
          </FormSection>
        ))
      )}
    </div>
  );
} 