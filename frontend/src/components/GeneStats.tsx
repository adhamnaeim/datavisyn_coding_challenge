import React, { useEffect, useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Badge,
  Grid,
  Loader,
  Text,
} from '@mantine/core';

type GeneStatsData = {
  total_genes: number;
  unique_chromosomes: number;
  top_biotypes: Record<string, number>;
  gene_length: {
    min: number;
    max: number;
    mean: number;
  };
  null_counts: {
    gene_symbol: number;
    name: number;
    biotype: number;
    chromosome: number;
  };
};

type Props = {
    onBiotypeSelect?: (biotype: string) => void;
  };

const GeneStats: React.FC<Props> = ({ onBiotypeSelect }) => {
    const [stats, setStats] = useState<GeneStatsData | null>(null);
    
    useEffect(() => {
        fetch('http://localhost:8000/genes/stats')
        .then(res => res.json())
        .then(data => setStats(data));
    }, []);
    

  if (!stats) return <Loader variant="dots" />;

  return (
    <Paper withBorder radius="md" p="md" mt="md">
      <Grid gutter="md">
        <Grid.Col span={6}>
          <Stack spacing="xs">
            <Title order={4}>Dataset Info</Title>
            <Text><strong>Total Genes:</strong> {stats.total_genes.toLocaleString()}</Text>
            <Text><strong>Unique Chromosomes:</strong> {stats.unique_chromosomes}</Text>
            <Text mt="sm"><strong>Gene Length (bp):</strong></Text>
            <Text size="sm">Min: {stats.gene_length.min.toLocaleString()}</Text>
            <Text size="sm">Max: {stats.gene_length.max.toLocaleString()}</Text>
            <Text size="sm">Mean: {Math.round(stats.gene_length.mean).toLocaleString()}</Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack spacing="xs">
            <Title order={4}>Top Biotypes</Title>
            <Group spacing="xs">
              {Object.entries(stats.top_biotypes).map(([type, count]) => (
                <Badge
                  key={type}
                  variant="light"
                  color="blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onBiotypeSelect?.(type)}
                >
                  {type}: {count.toLocaleString()}
                </Badge>
              ))}
            </Group>

            <div style={{ marginTop: '1rem' }}>
              <Text fw={700}>Missing Values:</Text>
              <Stack spacing={2}>
                <Text size="sm">Gene Symbol: {stats.null_counts.gene_symbol.toLocaleString()}</Text>
                <Text size="sm">Name: {stats.null_counts.name.toLocaleString()}</Text>
                <Text size="sm">Biotype: {stats.null_counts.biotype.toLocaleString()}</Text>
                <Text size="sm">Chromosome: {stats.null_counts.chromosome.toLocaleString()}</Text>
              </Stack>
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default GeneStats;