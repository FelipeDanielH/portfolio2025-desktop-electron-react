import { ipcMain } from 'electron';
import { HomeEducationService } from '../services/homeEducationService';

export function registerHomeEducationHandlers(baseURL: string) {
  const homeEducationService = new HomeEducationService(baseURL);

  ipcMain.handle('homeEducation:get', async () => {
    return homeEducationService.get();
  });

  ipcMain.handle('homeEducation:update', async (_event, data) => {
    return homeEducationService.update(data);
  });
} 