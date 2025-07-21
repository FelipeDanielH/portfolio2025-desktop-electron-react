import { ipcMain } from 'electron';
import { HomeExperienceService } from '../services/homeExperienceService';

export function registerHomeExperienceHandlers(baseURL: string) {
  const homeExperienceService = new HomeExperienceService(baseURL);

  ipcMain.handle('homeExperience:get', async () => {
    return homeExperienceService.get();
  });

  ipcMain.handle('homeExperience:update', async (_event, data) => {
    return homeExperienceService.update(data);
  });
} 