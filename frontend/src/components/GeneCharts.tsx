import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { Gene } from './GeneTable';
import {
  Paper,
  Title,
  Button,
  Group,
  Stack,
  Switch,
  Select,
  SegmentedControl,
  useMantineTheme,
} from '@mantine/core';

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
  const [featureType, setFeatureType] = useState<'biotype' | 'chromosome'>('biotype');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [topN, setTopN] = useState<string>('10');
  const [lengthChartType, setLengthChartType] = useState<'histogram' | 'box'>('histogram');

  const theme = useMantineTheme();
  const dynamicColors = theme.colors.blue.slice(0, 30).reverse();

  const getTopNData = (field: keyof Gene) => {
    const counts: Record<string, number> = {};
    genes.forEach((g) => {
      const value = g[field];
      if (value) counts[value] = (counts[value] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const limit = topN === 'all' ? sorted.length : Number(topN);
    const top = sorted.slice(0, limit);
    return {
      labels: top.map(([k]) => k),
      values: top.map(([_, v]) => v),
    };
  };

  const histogramData = useMemo(() =>
    genes.map(g => g.gene_length).filter(len => typeof len === 'number' && isFinite(len) && len > 0),
    [genes]
  );

  const featureData = useMemo(() => getTopNData(featureType), [genes, featureType, topN]);

  const charts = [
    featureData.labels.length > 1 && (
      <Stack spacing="xs" key="topNFeatures">
        <Group position="apart">
          <Title order={4}>Top {featureType === 'biotype' ? 'Biotypes' : 'Chromosomes'}</Title>
          <Group spacing="xs">
            <SegmentedControl
              size="xs"
              value={featureType}
              onChange={(value: 'biotype' | 'chromosome') => setFeatureType(value)}
              data={[
                { label: 'Biotype', value: 'biotype' },
                { label: 'Chromosome', value: 'chromosome' },
              ]}
            />
            <SegmentedControl
              size="xs"
              value={chartType}
              onChange={(value: 'bar' | 'pie') => setChartType(value)}
              data={[
                { label: 'Bar', value: 'bar' },
                { label: 'Pie', value: 'pie' },
              ]}
            />
            <Select
              size="xs"
              style={{ width: 100 }}
              value={topN}
              onChange={(value) => setTopN(value!)}
              data={[
                { value: '5', label: 'Top 5' },
                { value: '10', label: 'Top 10' },
                { value: 'all', label: 'All' },
              ]}
            />
          </Group>
        </Group>
        <Plot
          data={[
            chartType === 'bar'
              ? {
                  type: 'bar',
                  x: featureData.labels,
                  y: featureData.values,
                  marker: { color: featureData.labels.map((_, i) => dynamicColors[i % dynamicColors.length]) },
                }
              : {
                  type: 'pie',
                  labels: featureData.labels,
                  values: featureData.values,
                  marker: { colors: dynamicColors },
                },
          ]}
          layout={{
            title: `Top ${topN} ${featureType === 'biotype' ? 'Biotypes' : 'Chromosomes'}`,
            showlegend: chartType === 'pie',
            margin: { t: 40, l: 40, r: 30, b: 60 },
          }}
        />
      </Stack>
    ),
    histogramData.length > 0 && (
      <Stack spacing="xs" key="geneLength">
        <Group position="apart">
          <Title order={4}>Gene Length Distribution</Title>
          <SegmentedControl
            size="xs"
            value={lengthChartType}
            onChange={(value: 'histogram' | 'box') => setLengthChartType(value)}
            data={[
              { label: 'Histogram', value: 'histogram' },
              { label: 'Box Plot', value: 'box' },
            ]}
          />
        </Group>
        {lengthChartType === 'histogram' ? (
          <Plot
            data={[{
              type: 'histogram',
              x: histogramData,
              marker: {
                color: histogramData.map((_, i) => dynamicColors[i % dynamicColors.length]),
              },
            }]}
            layout={{
              title: 'Distribution of Gene Lengths',
              xaxis: { title: 'Gene Length (bp)' },
              yaxis: { title: 'Frequency' },
              margin: { t: 40, l: 40, r: 30, b: 60 },
            }}
          />
        ) : (
          <Plot
            data={[{
              type: 'box',
              y: histogramData,
              boxpoints: 'all',
              jitter: 0.3,
              pointpos: 0,
              marker: { color: dynamicColors[0] },
            }]}
            layout={{
              title: 'Gene Length Box Plot',
              yaxis: { title: 'Gene Length (bp)' },
              margin: { t: 40, l: 40, r: 30, b: 60 },
            }}
          />
        )}
      </Stack>
    ),
  ].filter(Boolean);

  if (charts.length === 0) return null;

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