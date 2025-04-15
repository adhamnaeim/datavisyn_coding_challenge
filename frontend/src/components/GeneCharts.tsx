import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Gene } from './GeneTable';

type Filters = {
  chromosome?: string;
  biotype?: string;
  minLength?: number;
  maxLength?: number;
};

type Props = {
  genes: Gene[];
  filters: Filters;
};

const GeneCharts: React.FC<Props> = ({ genes, filters }) => {
  const biotypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    genes.forEach((g) => {
      if (g.biotype) counts[g.biotype] = (counts[g.biotype] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return {
      labels: sorted.map(([k]) => k),
      values: sorted.map(([_, v]) => v),
    };
  }, [genes]);

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

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2>Interactive Charts (Filtered)</h2>

      {!filters.biotype && biotypeData.labels.length > 0 && (
        <>
          <h3>Top 5 Gene Biotypes</h3>
          <Plot
            data={[{
              type: 'bar',
              x: biotypeData.labels,
              y: biotypeData.values,
              marker: { color: 'steelblue' },
            }]}
            layout={{
              title: 'Top Biotypes by Count',
              xaxis: { title: 'Biotype' },
              yaxis: { title: 'Count' },
              margin: { t: 40, l: 40, r: 30, b: 60 },
            }}
          />
        </>
      )}

      {!filters.chromosome && chromosomeData.labels.length > 0 && (
        <>
          <h3>Genes per Chromosome</h3>
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
        </>
      )}

      {geneLengths.length > 0 && (
        <>
          <h3>Gene Length Distribution</h3>
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
        </>
      )}
    </div>
  );
};

export default GeneCharts;
