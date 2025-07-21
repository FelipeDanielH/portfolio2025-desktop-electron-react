import { ipcMain } from 'electron';
import { ExperienceService } from '../services/experienceService';

export function setupExperienceHandlers(baseURL: string) {
  const experienceService = new ExperienceService(baseURL);
  // Obtener todas las experiencias
  ipcMain.handle('api:experience:getAll', async () => {
    try {
      const experiences = await experienceService.getAll();
      return experiences;
    } catch (error) {
      console.error('❌ IPC: Error getting experiences:', error);
      throw error;
    }
  });



  // Obtener experiencia por ID
  ipcMain.handle('api:experience:getById', async (_, id: string) => {
    try {
      const experience = await experienceService.getById(id);
      return experience;
    } catch (error) {
      console.error('❌ IPC: Error getting experience:', error);
      throw error;
    }
  });

  // Crear nueva experiencia
  ipcMain.handle('api:experience:create', async (_, data: any) => {
    try {
      const experience = await experienceService.create(data);
      return experience;
    } catch (error) {
      console.error('❌ IPC: Error creating experience:', error);
      throw error;
    }
  });

  // Actualizar experiencia
  ipcMain.handle('api:experience:update', async (_, id: string, data: any) => {
    try {
      const experience = await experienceService.update(id, data);
      return experience;
    } catch (error) {
      console.error('❌ IPC: Error updating experience:', error);
      throw error;
    }
  });

  // Eliminar experiencia
  ipcMain.handle('api:experience:delete', async (_, id: string) => {
    try {
      const result = await experienceService.delete(id);
      return result;
    } catch (error) {
      console.error('❌ IPC: Error deleting experience:', error);
      throw error;
    }
  });
} 