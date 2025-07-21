import { ipcMain } from 'electron';
import { HomeCallToActionService } from '../services/homeCallToActionService';

export function registerHomeCallToActionHandlers(baseURL: string) {
  const homeCallToActionService = new HomeCallToActionService(baseURL);

  ipcMain.handle('homeCallToAction:get', async () => {
    return homeCallToActionService.get();
  });

  ipcMain.handle('homeCallToAction:update', async (_event, data) => {
    return homeCallToActionService.update(data);
  });
} 