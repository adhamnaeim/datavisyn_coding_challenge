import React, { useEffect, useState } from 'react';
import './App.css';
import GeneTable from './components/GeneTable';
import { Gene } from './types/gene';
import GeneFilters from './components/GeneFilters';
import GeneStats from './components/GeneStats';
import GeneCharts from './components/GeneCharts';
import AddGeneForm from './components/AddGeneForm';
import {
  AppShell,
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  Switch,
  Paper,
  Transition,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      <Text size="lg">{dark ? '☀️' : '🌙'}</Text>
    </ActionIcon>
  );
}

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [allGenes, setAllGenes] = useState<Gene[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [useFullDataForCharts, setUseFullDataForCharts] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [filters, setFilters] = useState<{ chromosome?: string; biotype?: string; minLength?: number; maxLength?: number }>({});
  const [sort, setSort] = useState<string | undefined>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [filterSearch, setFilterSearch] = useState(true);

  const buildParams = (includePagination = true, includeSorting = true) => {
    const params = new URLSearchParams();
    if (filters.chromosome) params.append('chromosome', filters.chromosome);
    if (filters.biotype) params.append('biotype', filters.biotype);
    if (filters.minLength) params.append('min_length', String(filters.minLength));
    if (filters.maxLength) params.append('max_length', String(filters.maxLength));
    if (search && filterSearch) params.append('search', search);
    if (includeSorting && sort) {
      params.append('sort', sort);
      params.append('order', order);
    }
    if (includePagination) {
      params.append('offset', offset.toString());
      params.append('limit', limit.toString());
    }
    return params;
  };

  const fetchGenes = () => {
    fetch(`http://localhost:8000/genes?${buildParams(true).toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setGenes(data.results);
        setTotal(data.total);
      });

    fetch(`http://localhost:8000/genes?${buildParams(false, false).toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setAllGenes(data.results);
        setRefreshStatsKey((k) => k + 1); 
      });
  };

  const fetchFilters = () => {
    fetch('http://localhost:8000/genes/filters')
      .then((res) => res.json())
      .then(setFilterOptions);
  };

  useEffect(() => {
    fetchGenes();
    fetchFilters();
  }, [filters, sort, order, search, offset, limit, filterSearch]);

  const handlePrev = () => setOffset((prev) => Math.max(0, prev - limit));
  const handleNext = () => setOffset((prev) => prev + limit);
  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setOffset(0);
  };
  const clearSorting = () => setSort(undefined);
  const [refreshStatsKey, setRefreshStatsKey] = useState(0);

  const from = offset + 1;
  const to = Math.min(offset + limit, total);

  return (
    <AppShell padding="xl">
      <Container size="lg" px="md" >
        <Stack spacing="xl" >
          <Group position="apart">
            <div>
              <Title order={1}>Human Genes Viewer</Title>
              <Text size="md" color="dimmed">
                Explore and analyze human gene data interactively.
              </Text>
            </div>
            <ThemeToggle />
          </Group>

          <Paper shadow="xs" radius="md" p="md" className="themed-card">
            <GeneStats 
            refreshKey={refreshStatsKey}
            onBiotypeSelect={(biotype) => setFilters((prev) => ({ ...prev, biotype }))} />
          </Paper>

          <Paper shadow="xs" radius="md" p="md" className="themed-card">
            <GeneCharts
              genes={useFullDataForCharts ? allGenes : genes}
              filters={filters}
              useFullDataForCharts={useFullDataForCharts}
              onToggleDataScope={setUseFullDataForCharts}
            />
          </Paper>

          <Paper shadow="xs" radius="md" p="md" className="themed-card">
            <AddGeneForm onSuccess={fetchGenes} onRefreshFilters={fetchFilters} />
          </Paper>

          <Paper shadow="xs" radius="md" p="md" className="themed-card">
            <Stack>
              <Switch
                  label="filter by search term only"
                  checked={filterSearch}
                  onChange={(event) => setFilterSearch(event.currentTarget.checked)}
                  size="xs"
              />
              <TextInput
                placeholder="Search genes..."
                value={search}
                onChange={(e) => {
                  setOffset(0);
                  setSearch(e.currentTarget.value);
                }}
              />

              <GeneFilters filters={filters} onChange={setFilters} options={filterOptions} />

              <Group position="apart">
                <Button onClick={clearFilters} variant="light" color="red">
                  Clear Filters
                </Button>
                <Button onClick={clearSorting} variant="light" color="red">
                  Clear Sorting
                </Button>
              </Group>

              <Group position="apart">
                <Text size="sm">Showing {from}–{to} of {total} results</Text>
                <Group spacing="xs">
                  <Select
                    size="xs"
                    value={String(limit)}
                    onChange={(value) => {
                      setLimit(Number(value));
                      setOffset(0);
                    }}
                    data={['50', '100', '500', '1000']}
                    style={{ width: 100 }}
                  />
                  <Button onClick={handlePrev} disabled={offset === 0} size="xs">Previous</Button>
                  <Button onClick={handleNext} disabled={offset + limit >= total} size="xs">Next</Button>
                </Group>
              </Group>

              <Button size="xs" variant="subtle" onClick={() => setShowTable((prev) => !prev)}>
                {showTable ? 'Hide Table' : 'Show Table'}
              </Button>

              <Transition mounted={showTable} transition="fade" duration={300} timingFunction="ease">
                {(styles) => (
                  <div style={styles}>
                    <GeneTable
                      allGenes={allGenes}
                      genes={genes}
                      sort={sort}
                      order={order}
                      search={search}
                      filterSearch={filterSearch}
                      onSortChange={(field) => {
                        setOffset(0);
                        setSort(field);
                        setOrder(prev => (sort === field && order === 'asc' ? 'desc' : 'asc'));
                      }}
                    />
                  </div>
                )}
              </Transition>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </AppShell>
  );
}

export default App;