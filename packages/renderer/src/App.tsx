import React from 'react';
import { HeroEditor } from './components/HeroEditor';

function App() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <HeroEditor />
    </main>
  );
}

export default App;
