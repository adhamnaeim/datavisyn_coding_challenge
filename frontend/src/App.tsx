import React, { useEffect, useState } from 'react';
import './App.css';
import GeneTable, { Gene } from './components/GeneTable';
import { fetchGenes } from './api/genes';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);

  useEffect(() => {
    fetchGenes()
      .then(setGenes)
      .catch((err) => console.error('Failed to fetch genes:', err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Human Genes Viewer</h1>
        <p>Welcome to the gene data visualization app.</p>
      </header>
      <main>
        <GeneTable genes={genes} />
      </main>
    </div>
  );
}

export default App;
