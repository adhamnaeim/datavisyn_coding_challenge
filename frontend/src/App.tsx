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
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(50); // page size
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.chromosome) params.append('chromosome', filters.chromosome);
    if (filters.biotype) params.append('biotype', filters.biotype);
    if (filters.minLength) params.append('min_length', String(filters.minLength));
    if (filters.maxLength) params.append('max_length', String(filters.maxLength));
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    params.append('offset', offset.toString());
    params.append('limit', limit.toString());

    fetch(`http://localhost:8000/genes?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setGenes(data.results);
        setTotal(data.total);
      });
  }, [filters, sort, order, search, offset, limit]);

  const handlePrev = () => setOffset(prev => Math.max(0, prev - limit));
  const handleNext = () => setOffset(prev => prev + limit);

  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setOffset(0);
  };

  const from = offset + 1;
  const to = Math.min(offset + limit, total);

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
          onChange={(e) => {
            setOffset(0);
            setSearch(e.target.value);
          }}
        />
        <GeneFilters filters={filters} onChange={setFilters} />
        <button onClick={clearFilters}>Clear Filters</button>
        <GeneTable
          genes={genes}
          sort={sort}
          order={order}
          search={search}
          onSortChange={(field) => {
            setOffset(0);
            setSort(field);
            setOrder(prev => (sort === field && order === 'asc' ? 'desc' : 'asc'));
          }}
        />
        <div>
          <p>Showing {from}–{to} of {total} results</p>
          <button onClick={handlePrev} disabled={offset === 0}>Previous</button>
          <button onClick={handleNext} disabled={offset + limit >= total}>Next</button>
        </div>
      </main>
    </div>
  );
}

export default App;