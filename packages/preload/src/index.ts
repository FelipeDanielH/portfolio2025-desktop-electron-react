import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getHero: () => ipcRenderer.invoke('api:hero:get'),
  about: {
    getAll: () => ipcRenderer.invoke('api:about:get'),
    create: (data: any) => ipcRenderer.invoke('api:about:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('api:about:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('api:about:delete', id),
  },
  skills: {
    getAll: () => ipcRenderer.invoke('api:skills:getAll'),
    getOrdered: () => ipcRenderer.invoke('api:skills:getOrdered'),
    getById: (id: string) => ipcRenderer.invoke('api:skills:getById', id),
    create: (data: any) => ipcRenderer.invoke('api:skills:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('api:skills:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('api:skills:delete', id),
    getByCategoria: (categoriaId: string) => ipcRenderer.invoke('api:skills:getByCategoria', categoriaId),
    getByNivel: (nivel: string) => ipcRenderer.invoke('api:skills:getByNivel', nivel),
  },
  categories: {
    getAll: () => ipcRenderer.invoke('api:categories:getAll'),
    getOrdered: () => ipcRenderer.invoke('api:categories:getOrdered'),
    getById: (id: string) => ipcRenderer.invoke('api:categories:getById', id),
    create: (data: any) => ipcRenderer.invoke('api:categories:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('api:categories:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('api:categories:delete', id),
  },
  homeSkills: {
    get: () => ipcRenderer.invoke('homeSkills:get'),
    update: (data: any) => ipcRenderer.invoke('homeSkills:update', data),
  },
  homeExperience: {
    get: () => ipcRenderer.invoke('homeExperience:get'),
    update: (data: any) => ipcRenderer.invoke('homeExperience:update', data),
  },
  homeProjects: {
    get: () => ipcRenderer.invoke('homeProjects:get'),
    update: (data: any) => ipcRenderer.invoke('homeProjects:update', data),
  },
  homeEducation: {
    get: () => ipcRenderer.invoke('homeEducation:get'),
    update: (data: any) => ipcRenderer.invoke('homeEducation:update', data),
  },
  homeAbout: {
    get: () => ipcRenderer.invoke('homeAbout:get'),
    update: (data: any) => ipcRenderer.invoke('homeAbout:update', data),
  },
  homeCertifications: {
    get: () => ipcRenderer.invoke('homeCertifications:get'),
    update: (data: any) => ipcRenderer.invoke('homeCertifications:update', data),
  },
  homeHero: {
    get: () => ipcRenderer.invoke('homeHero:get'),
    update: (data: any) => ipcRenderer.invoke('homeHero:update', data),
  },
  homeContact: {
    get: () => ipcRenderer.invoke('homeContact:get'),
    update: (data: any) => ipcRenderer.invoke('homeContact:update', data),
  },
  homeCallToAction: {
    get: () => ipcRenderer.invoke('homeCallToAction:get'),
    update: (data: any) => ipcRenderer.invoke('homeCallToAction:update', data),
  },
  experience: {
    getAll: () => ipcRenderer.invoke('api:experience:getAll'),
    getById: (id: string) => ipcRenderer.invoke('api:experience:getById', id),
    create: (data: any) => ipcRenderer.invoke('api:experience:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('api:experience:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('api:experience:delete', id),
  },
  projects: {
    getAll: () => ipcRenderer.invoke('api:projects:getAll'),
    getById: (id: string) => ipcRenderer.invoke('api:projects:getById', id),
    create: (data: any) => ipcRenderer.invoke('api:projects:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('api:projects:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('api:projects:delete', id),
  },
  techs: {
    getAll: () => ipcRenderer.invoke('api:techs:getAll'),
    getById: (id: string) => ipcRenderer.invoke('api:techs:getById', id),
    create: (data: any) => ipcRenderer.invoke('api:techs:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('api:techs:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('api:techs:delete', id),
  },
  education: {
    getAll: () => ipcRenderer.invoke('education:getAll'),
    getById: (id: string) => ipcRenderer.invoke('education:getById', id),
    create: (data: any) => ipcRenderer.invoke('education:create', data),
    update: (id: string, data: any) => ipcRenderer.invoke('education:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('education:delete', id),
    getByType: (tipo: "formacion" | "certificacion") => ipcRenderer.invoke('education:getByType', tipo),
    getByStatus: (estado: "En curso" | "Completado" | "Abandonado") => ipcRenderer.invoke('education:getByStatus', estado),
  },
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url'),
});
