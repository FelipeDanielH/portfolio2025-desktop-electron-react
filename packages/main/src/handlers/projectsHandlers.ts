import { ipcMain } from 'electron';
import { ProjectsService } from '../services/projectsService';

export function setupProjectsHandlers(baseURL: string) {
  const projectsService = new ProjectsService(baseURL);

  // Obtener todos los proyectos
  ipcMain.handle('api:projects:getAll', async () => {
    try {
      const projects = await projectsService.getAll();
      return projects;
    } catch (error) {
      console.error('❌ IPC: Error getting projects:', error);
      throw error;
    }
  });

  // Obtener proyecto por ID
  ipcMain.handle('api:projects:getById', async (_, id: string) => {
    try {
      const project = await projectsService.getById(id);
      return project;
    } catch (error) {
      console.error('❌ IPC: Error getting project:', error);
      throw error;
    }
  });

  // Crear nuevo proyecto
  ipcMain.handle('api:projects:create', async (_, data: any) => {
    try {
      const project = await projectsService.create(data);
      return project;
    } catch (error) {
      console.error('❌ IPC: Error creating project:', error);
      throw error;
    }
  });

  // Actualizar proyecto
  ipcMain.handle('api:projects:update', async (_, id: string, data: any) => {
    try {
      const project = await projectsService.update(id, data);
      return project;
    } catch (error) {
      console.error('❌ IPC: Error updating project:', error);
      throw error;
    }
  });

  // Eliminar proyecto
  ipcMain.handle('api:projects:delete', async (_, id: string) => {
    try {
      const result = await projectsService.delete(id);
      return result;
    } catch (error) {
      console.error('❌ IPC: Error deleting project:', error);
      throw error;
    }
  });
} 