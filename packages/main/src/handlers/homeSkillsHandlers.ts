import { ipcMain } from 'electron';
import { HomeSkillsService } from '../services/homeSkillsService';

export function registerHomeSkillsHandlers(baseURL: string) {
  const homeSkillsService = new HomeSkillsService(baseURL);

  ipcMain.handle('homeSkills:get', async () => {
    return homeSkillsService.get();
  });

  ipcMain.handle('homeSkills:update', async (_event, data) => {
    return homeSkillsService.update(data);
  });
} 