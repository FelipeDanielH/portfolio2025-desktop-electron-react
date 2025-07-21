import { ipcMain } from 'electron';
import { HomeContactService } from '../services/homeContactService';

export function registerHomeContactHandlers(baseURL: string) {
  const homeContactService = new HomeContactService(baseURL);

  ipcMain.handle('homeContact:get', async () => {
    return homeContactService.get();
  });

  ipcMain.handle('homeContact:update', async (_event, data) => {
    return homeContactService.update(data);
  });
} 