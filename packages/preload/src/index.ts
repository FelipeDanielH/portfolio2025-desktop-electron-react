import { contextBridge, ipcRenderer } from 'electron';

const getBackendURL = async (): Promise<string> => {
  const url = await ipcRenderer.invoke('get-backend-url');
  console.log('🌐 BACKEND_URL recibido vía IPC:', url);
  return url;
};

contextBridge.exposeInMainWorld('electronAPI', {
  getHero: async () => {
    try {
      const baseURL = await getBackendURL();
      const response = await fetch(`${baseURL}/home`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Error al obtener Hero:', error);
      return null;
    }
  },
});
