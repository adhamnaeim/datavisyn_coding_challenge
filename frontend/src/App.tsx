import React, { useEffect, useState } from 'react';
import './App.css';
import GeneTable, { Gene } from './components/GeneTable';
import GeneFilters from './components/GeneFilters';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [filters, setFilters] = useState<{
    chromosome?: string;
    biotype?: string;
    minLength?: number;
    maxLength?: number;
  }>({});

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.chromosome) params.append('chromosome', filters.chromosome);
    if (filters.biotype) params.append('biotype', filters.biotype);
    if (filters.minLength) params.append('min_length', String(filters.minLength));
    if (filters.maxLength) params.append('max_length', String(filters.maxLength));

    fetch(`http://localhost:8000/genes?${params.toString()}`)
      .then(res => res.json())
      .then(data => setGenes(data.results));
  }, [filters]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Human Genes Viewer</h1>
        <p>Welcome to the gene data visualization app.</p>
      </header>
      <main>
        <GeneFilters filters={filters} onChange={setFilters} />
        <GeneTable genes={genes} />
      </main>
    </div>
  );
}

export default App;