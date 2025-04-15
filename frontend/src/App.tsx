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

  const [sort, setSort] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.chromosome) params.append('chromosome', filters.chromosome);
    if (filters.biotype) params.append('biotype', filters.biotype);
    if (filters.minLength) params.append('min_length', String(filters.minLength));
    if (filters.maxLength) params.append('max_length', String(filters.maxLength));

    if (sort) params.append('sort', sort);
    if (order) params.append('order', order); 

    if (search) params.append('search', search);

    fetch(`http://localhost:8000/genes?${params.toString()}`)
      .then(res => res.json())
      .then(data => setGenes(data.results));
  }, [filters,sort, order, search]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Human Genes Viewer</h1>
        <p>Welcome to the gene data visualization app.</p>
      </header>
      <main>
        <input
          type="text"
          placeholder="Search genes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <GeneFilters filters={filters} onChange={setFilters} />
        <GeneTable
          genes={genes}
          sort={sort}
          order={order}
          onSortChange={(field) => {
            setSort(field);
            setOrder((prev) => (sort === field && order === 'asc' ? 'desc' : 'asc'));
          }}
          search={search}
        />
      </main>
    </div>
  );
}

export default App;