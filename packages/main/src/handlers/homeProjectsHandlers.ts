import { ipcMain } from 'electron';
import { HomeProjectsService } from '../services/homeProjectsService';

export function registerHomeProjectsHandlers(baseURL: string) {
  const homeProjectsService = new HomeProjectsService(baseURL);

  ipcMain.handle('homeProjects:get', async () => {
    return homeProjectsService.get();
  });

  ipcMain.handle('homeProjects:update', async (_event, data) => {
    return homeProjectsService.update(data);
  });
} 