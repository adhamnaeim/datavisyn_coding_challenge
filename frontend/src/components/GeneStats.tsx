import React, { useEffect, useState } from 'react';
import { Paper, Grid, Title, Text, List, ThemeIcon, Loader } from '@mantine/core';

type GeneStatsData = {
  total_genes: number;
  unique_chromosomes: number;
  top_biotypes: Record<string, number>;
  gene_length: {
    min: number;
    max: number;
    mean: number;
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
          <Title order={4} mb="xs">Dataset Info</Title>
          <Text><strong>Total Genes:</strong> {stats.total_genes}</Text>
          <Text><strong>Unique Chromosomes:</strong> {stats.unique_chromosomes}</Text>
          <Text mt="sm"><strong>Gene Length (bp):</strong></Text>
          <List spacing="xs" size="sm">
            <List.Item>Min: {stats.gene_length.min}</List.Item>
            <List.Item>Max: {stats.gene_length.max}</List.Item>
            <List.Item>Mean: {stats.gene_length.mean}</List.Item>
          </List>
        </Grid.Col>

        <Grid.Col span={6}>
          <Title order={4} mb="xs">Top Biotypes</Title>
          <List spacing="xs" size="sm">
            {Object.entries(stats.top_biotypes).map(([type, count]) => (
                <List.Item
                    key={type}
                    onClick={() => onBiotypeSelect?.(type)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                    >
                    {type}: {count}
                </List.Item>
            ))}
          </List>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default GeneStats;