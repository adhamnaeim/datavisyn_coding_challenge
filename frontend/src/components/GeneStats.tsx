import React, { useEffect, useState } from 'react';

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

const GeneStats: React.FC = () => {
  const [stats, setStats] = useState<GeneStatsData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/genes/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <p>Loading statistics...</p>;

  return (
    <div className="gene-stats-grid">
      <div>
        <h2>Dataset Info</h2>
        <p><strong>Total Genes:</strong> {stats.total_genes}</p>
        <p><strong>Unique Chromosomes:</strong> {stats.unique_chromosomes}</p>
        <p><strong>Gene Length (bp):</strong></p>
        <ul>
          <li>Min: {stats.gene_length.min}</li>
          <li>Max: {stats.gene_length.max}</li>
          <li>Mean: {stats.gene_length.mean}</li>
        </ul>
      </div>
      <div>
        <h2>Top Biotypes</h2>
        <ul>
          {Object.entries(stats.top_biotypes).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GeneStats;
