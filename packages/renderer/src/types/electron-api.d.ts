export {};

declare global {
  interface Window {
    electronAPI: {
      getHero: () => Promise<{
        title: string;
        subtitle: string;
        description: string;
      } | null>;
      getResumen: () => Promise<{
        bloques: Array<{
          id?: string;
          titulo: string;
          contenido: string;
          orden: number;
        }>;
      } | null>;
      saveResumen: (data: {
        bloques: Array<{
          id?: string;
          titulo: string;
          contenido: string;
          orden: number;
        }>;
      }) => Promise<boolean>;
    };
  }
}

export type BloqueResumen = {
  id?: string;
  titulo: string;
  contenido: string;
  orden: number;
};