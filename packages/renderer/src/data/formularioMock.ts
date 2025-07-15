export type Campo = {
  tipo: "texto" | "textarea";
  label: string;
  name: string;
  placeholder?: string;
};

export type SeccionMock =
  | {
      tipo: "singleton";
      campos: Campo[];
    }
  | {
      tipo: "lista";
      campos: Campo[];
    };

export type FormulariosMock = Record<string, SeccionMock>;

export const formulariosMock: FormulariosMock = {
  Hero: {
    tipo: "singleton",
    campos: [
      { name: "nombre", label: "Nombre completo", tipo: "texto", placeholder: "Felipe Henríquez" },
      { name: "titulo", label: "Título profesional", tipo: "texto", placeholder: "Desarrollador Full Stack" },
      { name: "claim", label: "Frase o claim", tipo: "textarea", placeholder: "Transformo ideas en código" },
      { name: "telefono", label: "Teléfono", tipo: "texto", placeholder: "+56 9 0000 0000" },
      { name: "ubicacion", label: "Ubicación", tipo: "texto", placeholder: "Santiago, Chile" },
      { name: "email", label: "Correo electrónico", tipo: "texto", placeholder: "correo@ejemplo.com" },
      { name: "linkedin", label: "LinkedIn", tipo: "texto", placeholder: "https://linkedin.com/in/felipe" },
      { name: "cv", label: "Link a CV", tipo: "texto", placeholder: "https://..." },
      { name: "boton_contacto", label: "Texto del botón", tipo: "texto", placeholder: "Contáctame" },
    ],
  },

  "Sobre mí": {
    tipo: "singleton",
    campos: [
      { name: "resumen", label: "Resumen general", tipo: "textarea", placeholder: "Soy desarrollador full stack..." },
      { name: "especialidades", label: "Especialidades (separadas por coma)", tipo: "texto", placeholder: "React, Spring Boot, MongoDB" },
    ],
  },
};
