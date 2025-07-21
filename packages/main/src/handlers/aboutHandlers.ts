import { ipcMain } from 'electron';
import { AboutService } from '../services/aboutService';

export function registerAboutHandlers(aboutService: AboutService) {
  ipcMain.handle('api:about:get', async () => {
    return aboutService.getAll();
  });

  ipcMain.handle('api:about:create', async (_event, data) => {
    return aboutService.create(data);
  });

  ipcMain.handle('api:about:update', async (_event, id, data) => {
    return aboutService.update(id, data);
  });

  ipcMain.handle('api:about:delete', async (_event, id) => {
    return aboutService.remove(id);
  });
} 