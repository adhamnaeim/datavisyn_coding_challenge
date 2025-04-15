import React, { useEffect, useState } from 'react';

type FilterOptions = {
  chromosomes: string[];
  biotypes: string[];
  gene_length_range: {
    min: number;
    max: number;
  };
};

type Props = {
  filters: {
    chromosome?: string;
    biotype?: string;
    minLength?: number;
    maxLength?: number;
  };
  onChange: (filters: Props['filters']) => void;
};

const GeneFilters: React.FC<Props> = ({ filters, onChange }) => {
  const [options, setOptions] = useState<FilterOptions | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/genes/filters")
      .then(res => res.json())
      .then(setOptions);
  }, []);

  if (!options) return <p>Loading filters...</p>;

  return (
    <div>
      <label>
        Chromosome:
        <select
          value={filters.chromosome || ""}
          onChange={e => onChange({ ...filters, chromosome: e.target.value || undefined })}
        >
          <option value="">All</option>
          {options.chromosomes.map(ch => (
            <option key={ch} value={ch}>{ch}</option>
          ))}
        </select>
      </label>

      <label>
        Biotype:
        <select
          value={filters.biotype || ""}
          onChange={e => onChange({ ...filters, biotype: e.target.value || undefined })}
        >
          <option value="">All</option>
          {options.biotypes.map(bt => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>
      </label>

      <label>
        Min Length:
        <input
          type="number"
          value={filters.minLength ?? options.gene_length_range.min}
          onChange={e => onChange({ ...filters, minLength: Number(e.target.value) })}
        />
      </label>

      <label>
        Max Length:
        <input
          type="number"
          value={filters.maxLength ?? options.gene_length_range.max}
          onChange={e => onChange({ ...filters, maxLength: Number(e.target.value) })}
        />
      </label>
    </div>
  );
};

export default GeneFilters;