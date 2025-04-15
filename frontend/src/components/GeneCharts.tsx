import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const GeneCharts: React.FC = () => {
  const [biotypeData, setBiotypeData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [chromosomeData, setChromosomeData] = useState<{ labels: string[]; values: number[] } | null>(null);
  const [geneLengths, setGeneLengths] = useState<number[] | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/genes/stats')
      .then(res => res.json())
      .then(data => {
        const labels = Object.keys(data.top_biotypes);
        const values = Object.values(data.top_biotypes) as number[];
        setBiotypeData({ labels, values });
      });

    fetch('http://localhost:8000/genes/filters')
      .then(res => res.json())
      .then(data => {
        const chromosomes = data.chromosomes;
        Promise.all(
          chromosomes.map((chr: string) =>
            fetch(`http://localhost:8000/genes?chromosome=${chr}&limit=1`).then(res => res.json())
          )
        ).then(responses => {
          const labels = chromosomes;
          const values = responses.map(r => r.total || 0);
          setChromosomeData({ labels, values });
        });
      });

    fetch('http://localhost:8000/genes?limit=1000')
      .then(res => res.json())
      .then(data => {
        const lengths = data.results.map((gene: any) => gene.gene_length);
        setGeneLengths(lengths);
      });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      {biotypeData && (
        <>
          <h2>Top 5 Gene Biotypes</h2>
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

      {chromosomeData && (
        <>
          <h2>Genes per Chromosome</h2>
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

      {geneLengths && (
        <>
          <h2>Gene Length Distribution</h2>
          <Plot
            data={[{
              type: 'histogram',
              x: geneLengths,
              marker: { color: 'salmon' },
            }]}
            layout={{
              title: 'Distribution of Gene Lengths (Sampled)',
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
