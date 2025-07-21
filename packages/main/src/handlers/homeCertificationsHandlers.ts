import { ipcMain } from 'electron';
import { HomeCertificationsService } from '../services/homeCertificationsService';

export function registerHomeCertificationsHandlers(baseURL: string) {
  const homeCertificationsService = new HomeCertificationsService(baseURL);

  ipcMain.handle('homeCertifications:get', async () => {
    return homeCertificationsService.get();
  });

  ipcMain.handle('homeCertifications:update', async (_event, data) => {
    return homeCertificationsService.update(data);
  });
} 