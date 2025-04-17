import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { Gene } from './GeneTable';
import { Paper, Title, Button, Group, Stack, Switch, Select } from '@mantine/core';

type Filters = {
  chromosome?: string;
  biotype?: string;
  minLength?: number;
  maxLength?: number;
};

type Props = {
  genes: Gene[];
  filters: Filters;
  onToggleDataScope?: (useFull: boolean) => void;
  useFullDataForCharts?: boolean;
};

const GeneCharts: React.FC<Props> = ({ genes, filters, onToggleDataScope, useFullDataForCharts }) => {
  const [activeChart, setActiveChart] = useState(0);
  const [topNBiotypes, setTopNBiotypes] = useState<string>('5');

  const biotypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    genes.forEach((g) => {
      if (g.biotype) counts[g.biotype] = (counts[g.biotype] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = topNBiotypes === 'all'
    ? sorted
    : sorted.slice(0, Number(topNBiotypes));

    return {
      labels: top.map(([k]) => k),
      values: top.map(([_, v]) => v),
    };
  }, [genes, topNBiotypes]);

  const chromosomeData = useMemo(() => {
    const counts: Record<string, number> = {};
    genes.forEach((g) => {
      counts[g.chromosome] = (counts[g.chromosome] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
    return {
      labels: sorted.map(([k]) => k),
      values: sorted.map(([_, v]) => v),
    };
  }, [genes]);

  const geneLengths = useMemo(() => genes.map(g => g.gene_length), [genes]);

  if (genes.length < 10) return null;

  const charts = [
    biotypeData.labels.length > 1 && (
      <Stack spacing="xs" key="biotype">
        <Group position="apart">
          <Title order={4}>Top Gene Biotypes</Title>
          <Select
            size="xs"
            style={{ width: 100 }}
            value={String(topNBiotypes)}
            onChange={(value) => setTopNBiotypes(value!)}
            data={[
                { value: '5', label: 'Top 5' },
                { value: '10', label: 'Top 10' },
                { value: '20', label: 'Top 20' },
                { value: 'all', label: 'All' },
              ]}
            allowDeselect={false}
          />
        </Group>
        <Plot
          data={[{
            type: 'bar',
            x: biotypeData.labels,
            y: biotypeData.values,
            marker: { color: 'steelblue' },
          }]}
          layout={{
            title: `Top ${topNBiotypes} Biotypes by Count`,
            xaxis: { title: 'Biotype' },
            yaxis: { title: 'Count' },
            margin: { t: 40, l: 40, r: 30, b: 60 },
          }}
        />
      </Stack>
    ),
    !filters.chromosome && chromosomeData.labels.length > 0 && (
      <Stack spacing="xs" key="chromosome">
        <Title order={4}>Genes per Chromosome</Title>
        <Plot
          data={[{
            type: 'bar',
            x: chromosomeData.labels,
            y: chromosomeData.values,
            marker: { color: 'darkgreen' },
          }]}
          layout={{
            title: 'Gene Count by Chromosome',
            xaxis: { title: 'Chromosome' },
            yaxis: { title: 'Count' },
            margin: { t: 40, l: 40, r: 30, b: 60 },
          }}
        />
      </Stack>
    ),
    geneLengths.length > 0 && (
      <Stack spacing="xs" key="length">
        <Title order={4}>Gene Length Distribution</Title>
        <Plot
          data={[{
            type: 'histogram',
            x: geneLengths,
            marker: { color: 'salmon' },
          }]}
          layout={{
            title: 'Distribution of Gene Lengths',
            xaxis: { title: 'Gene Length (bp)' },
            yaxis: { title: 'Frequency' },
            margin: { t: 40, l: 40, r: 30, b: 60 },
          }}
        />
      </Stack>
    ),
  ].filter(Boolean);

  return (
    <Paper withBorder radius="md" p="md" mt="md">
      <Group position="apart" mb="sm">
        <Title order={3}>Interactive Charts</Title>
        <Group spacing="xs">
          <Switch
            size="xs"
            label="Use full dataset"
            checked={useFullDataForCharts}
            onChange={(event) => onToggleDataScope?.(event.currentTarget.checked)}
          />
          <Button size="xs" onClick={() => setActiveChart((activeChart - 1 + charts.length) % charts.length)}>
            ← Prev
          </Button>
          <Button size="xs" onClick={() => setActiveChart((activeChart + 1) % charts.length)}>
            Next →
          </Button>
        </Group>
      </Group>
      {charts[activeChart]}
    </Paper>
  );
};

export default GeneCharts;
