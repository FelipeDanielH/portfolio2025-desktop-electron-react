export {};

declare global {
  interface Window {
    electronAPI: {
      getHero: () => Promise<{
        title: string;
        subtitle: string;
        description: string;
      } | null>;
    };
  }
}
