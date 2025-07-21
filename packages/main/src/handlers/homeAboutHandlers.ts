import { ipcMain } from 'electron';
import { HomeAboutService } from '../services/homeAboutService';

export function registerHomeAboutHandlers(baseURL: string) {
  const homeAboutService = new HomeAboutService(baseURL);

  ipcMain.handle('homeAbout:get', async () => {
    return homeAboutService.get();
  });

  ipcMain.handle('homeAbout:update', async (_event, data) => {
    return homeAboutService.update(data);
  });
} 