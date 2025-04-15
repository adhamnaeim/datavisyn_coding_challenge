import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const GeneCharts: React.FC = () => {
  const [biotypeData, setBiotypeData] = useState<{ labels: string[]; values: number[] } | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/genes/stats')
      .then(res => res.json())
      .then(data => {
        const labels = Object.keys(data.top_biotypes);
        const values = Object.values(data.top_biotypes) as number[];
        setBiotypeData({ labels, values });
      });
  }, []);

  if (!biotypeData) return <p>Loading charts...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2>Top 5 Gene Biotypes</h2>
      <Plot
        data={[
          {
            type: 'bar',
            x: biotypeData.labels,
            y: biotypeData.values,
            marker: { color: 'steelblue' },
          }
        ]}
        layout={{
          title: 'Top Biotypes by Count',
          xaxis: { title: 'Biotype' },
          yaxis: { title: 'Count' },
          margin: { t: 40, l: 40, r: 30, b: 60 },
        }}
      />
    </div>
  );
};

export default GeneCharts;