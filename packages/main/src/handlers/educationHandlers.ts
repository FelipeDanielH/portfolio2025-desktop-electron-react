import { ipcMain } from 'electron';
import { EducationService } from '../services/educationService';
import type { Education, EducationFormData } from '../types/education.types';

export function registerEducationHandlers(baseURL: string) {
  const educationService = new EducationService(baseURL);

  // GET /education - Obtener todas las entradas de educación
  ipcMain.handle('education:getAll', async () => {
    try {
      console.log('📝 education:getAll - Obteniendo todas las educaciones');
      const educations = await educationService.getAll();
      console.log('✅ education:getAll - Educaciones obtenidas:', educations.length);
      return educations;
    } catch (error) {
      // Solo loggear una vez si es error de conexión
      if (error instanceof Error && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
        console.log('⚠️ education:getAll - Backend no disponible, usando datos de ejemplo');
        // Retornar array vacío para que el frontend use datos de ejemplo
        return [];
      } else {
        console.error('❌ education:getAll - Error:', error);
      }
      throw error;
    }
  });

  // GET /education/:id - Obtener educación por ID
  ipcMain.handle('education:getById', async (_, id: string) => {
    try {
      console.log('📝 education:getById - Obteniendo educación:', id);
      const education = await educationService.getById(id);
      console.log('✅ education:getById - Educación obtenida');
      return education;
    } catch (error) {
      console.error('❌ education:getById - Error:', error);
      throw error;
    }
  });

  // POST /education - Crear nueva educación
  ipcMain.handle('education:create', async (_, data: EducationFormData) => {
    try {
      console.log('📝 education:create - Creando nueva educación:', data.titulo);
      const newEducation = await educationService.create(data);
      console.log('✅ education:create - Educación creada:', newEducation._id);
      return newEducation;
    } catch (error) {
      console.error('❌ education:create - Error:', error);
      throw error;
    }
  });

  // PUT /education/:id - Actualizar educación
  ipcMain.handle('education:update', async (_, id: string, data: Partial<Education>) => {
    try {
      console.log('📝 education:update - Actualizando educación:', id);
      const updatedEducation = await educationService.update(id, data);
      console.log('✅ education:update - Educación actualizada');
      return updatedEducation;
    } catch (error) {
      console.error('❌ education:update - Error:', error);
      throw error;
    }
  });

  // DELETE /education/:id - Eliminar educación
  ipcMain.handle('education:delete', async (_, id: string) => {
    try {
      console.log('📝 education:delete - Eliminando educación:', id);
      await educationService.delete(id);
      console.log('✅ education:delete - Educación eliminada');
      return true;
    } catch (error) {
      console.error('❌ education:delete - Error:', error);
      throw error;
    }
  });

  // GET /education?tipo=formacion - Obtener por tipo
  ipcMain.handle('education:getByType', async (_, tipo: "formacion" | "certificacion") => {
    try {
      console.log('📝 education:getByType - Obteniendo educaciones por tipo:', tipo);
      const educations = await educationService.getByType(tipo);
      console.log('✅ education:getByType - Educaciones obtenidas:', educations.length);
      return educations;
    } catch (error) {
      console.error('❌ education:getByType - Error:', error);
      throw error;
    }
  });

  // GET /education?estado=En curso - Obtener por estado
  ipcMain.handle('education:getByStatus', async (_, estado: "En curso" | "Completado" | "Abandonado") => {
    try {
      console.log('📝 education:getByStatus - Obteniendo educaciones por estado:', estado);
      const educations = await educationService.getByStatus(estado);
      console.log('✅ education:getByStatus - Educaciones obtenidas:', educations.length);
      return educations;
    } catch (error) {
      console.error('❌ education:getByStatus - Error:', error);
      throw error;
    }
  });
} 