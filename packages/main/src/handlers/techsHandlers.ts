import { ipcMain } from 'electron';
import { TechsService } from '../services/techsService';

export function setupTechsHandlers(baseURL: string) {
  const techsService = new TechsService(baseURL);

  // Obtener todas las tecnologías
  ipcMain.handle('api:techs:getAll', async () => {
    try {
      const techs = await techsService.getAll();
      return techs;
    } catch (error) {
      console.error('❌ IPC: Error getting techs:', error);
      throw error;
    }
  });

  // Obtener tecnología por ID
  ipcMain.handle('api:techs:getById', async (_, id: string) => {
    try {
      const tech = await techsService.getById(id);
      return tech;
    } catch (error) {
      console.error('❌ IPC: Error getting tech:', error);
      throw error;
    }
  });

  // Crear nueva tecnología
  ipcMain.handle('api:techs:create', async (_, data: any) => {
    try {
      const tech = await techsService.create(data);
      return tech;
    } catch (error) {
      console.error('❌ IPC: Error creating tech:', error);
      throw error;
    }
  });

  // Actualizar tecnología
  ipcMain.handle('api:techs:update', async (_, id: string, data: any) => {
    try {
      const tech = await techsService.update(id, data);
      return tech;
    } catch (error) {
      console.error('❌ IPC: Error updating tech:', error);
      throw error;
    }
  });

  // Eliminar tecnología
  ipcMain.handle('api:techs:delete', async (_, id: string) => {
    try {
      const result = await techsService.delete(id);
      return result;
    } catch (error) {
      console.error('❌ IPC: Error deleting tech:', error);
      throw error;
    }
  });
} 