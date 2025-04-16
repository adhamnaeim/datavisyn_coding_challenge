import React, { useEffect, useState } from 'react';
import './App.css';
import GeneTable, { Gene } from './components/GeneTable';
import GeneFilters from './components/GeneFilters';
import GeneStats from './components/GeneStats';
import GeneCharts from './components/GeneCharts';
import {
  AppShell,
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
} from '@mantine/core';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [allGenes, setAllGenes] = useState<Gene[]>([]);
  const [useFullDataForCharts, setUseFullDataForCharts] = useState(false);

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
  const [limit] = useState<number>(50);
  const [total, setTotal] = useState<number>(0);

  const buildParams = (includePagination = true) => {
    const params = new URLSearchParams();
    if (filters.chromosome) params.append('chromosome', filters.chromosome);
    if (filters.biotype) params.append('biotype', filters.biotype);
    if (filters.minLength) params.append('min_length', String(filters.minLength));
    if (filters.maxLength) params.append('max_length', String(filters.maxLength));
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    if (includePagination) {
      params.append('offset', offset.toString());
      params.append('limit', limit.toString());
    }
    return params;
  };

  useEffect(() => {
    // Table data (paginated)
    fetch(`http://localhost:8000/genes?${buildParams(true).toString()}`)
      .then(res => res.json())
      .then(data => {
        setGenes(data.results);
        setTotal(data.total);
      });
  }, [filters, sort, order, search, offset, limit]);

  useEffect(() => {
    if (useFullDataForCharts) {
      fetch(`http://localhost:8000/genes?${buildParams(false).toString()}`)
        .then(res => res.json())
        .then(data => setAllGenes(data.results));
    }
  }, [filters, sort, order, search, useFullDataForCharts]);

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
    <AppShell padding="md">
      <Container>
        <Title order={1} ta="center">Human Genes Viewer</Title>
        <Text ta="center" mb="lg">
          Welcome to the gene data visualization app.
        </Text>

        <Stack>
          <GeneStats onBiotypeSelect={(biotype) => {
            setFilters((prev) => ({ ...prev, biotype }));
            setOffset(0);
          }} />

          <GeneCharts
            genes={useFullDataForCharts ? allGenes : genes}
            filters={filters}
            useFullDataForCharts={useFullDataForCharts}
            onToggleDataScope={setUseFullDataForCharts}
          />

          <TextInput
            placeholder="Search genes..."
            value={search}
            onChange={(e) => {
              setOffset(0);
              setSearch(e.currentTarget.value);
            }}
          />

          <GeneFilters filters={filters} onChange={setFilters} />

          <Button onClick={clearFilters} variant="light" color="gray">
            Clear Filters
          </Button>

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

          <Group position="apart" mt="sm">
            <Text size="sm">Showing {from}–{to} of {total} results</Text>
            <Group spacing="xs">
              <Button onClick={handlePrev} disabled={offset === 0} size="xs">Previous</Button>
              <Button onClick={handleNext} disabled={offset + limit >= total} size="xs">Next</Button>
            </Group>
          </Group>
        </Stack>
      </Container>
    </AppShell>
  );
}

export default App;