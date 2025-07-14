
const seccionesPorPagina = {
  inicio: ['Hero', 'Tecnologías Principales', 'Habilidades', 'Experiencia', 'Contacto'],
  resumen: ['Perfil Profesional', 'Logros', 'Certificaciones', 'Educación'],
  proyectos: ['Proyecto Destacado', 'Proyecto Secundario', 'Repositorio GitHub'],
  contacto: ['Correo', 'LinkedIn', 'Formulario de Contacto']
};

const formulariosMock = {
  'Hero': [
    { label: 'Nombre', actual: 'Felipe Henríquez', type: 'text' },
    { label: 'Rol', actual: 'Full Stack Developer', type: 'text' },
    { label: 'Descripción', actual: 'Soy un desarrollador apasionado con experiencia en React, Node.js y MongoDB. He trabajado en múltiples proyectos escalables, manteniendo siempre las buenas prácticas y el enfoque mobile-first.', type: 'textarea' },
    { label: 'Ubicación', actual: 'Santiago, Chile', type: 'text' },
    { label: 'Foto de perfil (URL)', actual: 'https://example.com/foto.png', type: 'text' }
  ],
  'Tecnologías Principales': [
    { label: 'Stack Principal', actual: 'Next.js, Node.js, MongoDB', type: 'text' },
    { label: 'Frameworks preferidos', actual: 'React, Tailwind CSS, Express', type: 'text' },
    { label: 'Nivel de experiencia (1-10)', actual: '8', type: 'number' }
  ],
  'Habilidades': [
    { label: 'Lista de habilidades', actual: 'HTML, CSS, JavaScript, TypeScript, Docker, Git, REST APIs, CI/CD', type: 'textarea' },
    { label: 'Tecnologías en aprendizaje', actual: 'GraphQL, WebSockets', type: 'text' }
  ],
  'Experiencia': [
    { label: 'Último empleo', actual: 'ETPAY SpA - Soporte IT con APIs y AWS', type: 'text' },
    { label: 'Freelance actual', actual: 'E-commerce WooCommerce para clientas', type: 'text' },
    { label: 'Descripción extendida', actual: 'Implementación de funcionalidades completas, testing, deploy en Vercel y soporte a usuarios', type: 'textarea' }
  ],
  'Contacto': [
    { label: 'Email', actual: 'felipe.daniel.henriquez@gmail.com', type: 'text' },
    { label: 'Teléfono', actual: '+56 9 8469 2943', type: 'text' },
    { label: 'LinkedIn', actual: 'linkedin.com/in/felipe-henriquez', type: 'text' },
    { label: 'Portafolio web', actual: 'https://felipehenriquez.vercel.app', type: 'text' }
  ],
  'Perfil Profesional': [
    { label: 'Resumen largo', actual: 'Ingeniero en Informática con experiencia full stack. Apasionado por resolver problemas complejos y escribir código limpio. Me destaco por adaptarme rápidamente a nuevas tecnologías y trabajar en equipo.', type: 'textarea' }
  ],
  'Logros': [
    { label: 'Logro 1', actual: 'Deploy exitoso de app bancaria en producción', type: 'text' },
    { label: 'Logro 2', actual: 'Optimización de queries redujo tiempos en 60%', type: 'text' }
  ],
  'Certificaciones': [
    { label: 'Curso destacado', actual: 'React: De cero a experto – Udemy', type: 'text' },
    { label: 'Certificación DevOps', actual: 'Docker: Guía práctica para desarrolladores', type: 'text' }
  ],
  'Educación': [
    { label: 'Título profesional', actual: 'Ingeniería en Informática – Duoc UC 2021', type: 'text' },
    { label: 'Bootcamp', actual: 'Full Stack – Generation Chile 2025', type: 'text' }
  ],
  'Proyecto Destacado': [
    { label: 'Nombre', actual: 'Ecomarket', type: 'text' },
    { label: 'Descripción', actual: 'E-commerce full stack React + Spring Boot + MySQL. Funcionalidades completas y despliegue productivo.', type: 'textarea' }
  ],
  'Proyecto Secundario': [
    { label: 'Nombre', actual: 'BancoSimple', type: 'text' },
    { label: 'Descripción', actual: 'App bancaria con JWT, React y backend Spring Boot', type: 'textarea' }
  ],
  'Repositorio GitHub': [
    { label: 'URL', actual: 'https://github.com/FelipeDanielH', type: 'text' }
  ],
  'Correo': [
    { label: 'Email de contacto', actual: 'felipe.daniel.henriquez@gmail.com', type: 'text' }
  ],
  'LinkedIn': [
    { label: 'Perfil', actual: 'linkedin.com/in/felipe-henriquez', type: 'text' }
  ],
  'Formulario de Contacto': [
    { label: 'Mensaje predeterminado', actual: '¡Gracias por tu mensaje! Te responderé pronto.', type: 'textarea' }
  ]
};

function cambiarPagina(pagina) {
  const secciones = seccionesPorPagina[pagina] || [];
  const menu = document.getElementById("menu-secciones");
  menu.innerHTML = '';
  secciones.forEach(sec => {
    const li = document.createElement("li");
    li.textContent = sec;
    li.onclick = () => mostrarFormulario(sec);
    menu.appendChild(li);
  });
  document.getElementById("editor-area").innerHTML = `<h2>Página: ${pagina} - selecciona una sección</h2>`;
}

function mostrarFormulario(seccion) {
  const datos = formulariosMock[seccion];
  if (!datos) return;

  const contenedor = document.getElementById("editor-area");
  contenedor.innerHTML = `<h2>Editando sección: ${seccion}</h2>`;

  datos.forEach(campo => {
    const div = document.createElement("div");
    div.className = "form-section";
    div.innerHTML = `
      <p class='current-info'>${campo.label} actual:</p>
      <p class='current-info-text'><em>${campo.actual}</em></p>
      <label>${campo.label}:</label>
      ${campo.type === 'textarea'
        ? `<textarea rows='4'></textarea>`
        : `<input type='${campo.type}'/>`}
    `;
    contenedor.appendChild(div);
  });
}
