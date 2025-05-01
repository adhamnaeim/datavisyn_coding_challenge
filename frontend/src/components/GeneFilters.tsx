import React from 'react';
import { Select, NumberInput, Stack } from '@mantine/core';

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
  options?: FilterOptions | null;
};

const GeneFilters: React.FC<Props> = ({ filters, onChange, options }) => {
  if (!options) return <p>Loading filters...</p>;

  return (
    <Stack spacing="sm">
      <Select
        label="Chromosome"
        placeholder="All"
        size="sm"
        data={options.chromosomes.map((ch) => ({ value: ch, label: ch }))}
        value={filters.chromosome || null}
        onChange={(value) => onChange({ ...filters, chromosome: value || undefined })}
        clearable
      />

      <Select
        label="Biotype"
        placeholder="All"
        size="sm"
        data={options.biotypes.map((bt) => ({ value: bt, label: bt }))}
        value={filters.biotype || null}
        onChange={(value) => onChange({ ...filters, biotype: value || undefined })}
        clearable
      />

      <NumberInput
        label="Min Length"
        size="sm"
        min={options.gene_length_range.min}
        max={options.gene_length_range.max}
        value={filters.minLength ?? options.gene_length_range.min}
        onChange={(value) => onChange({ ...filters, minLength: value as number })}
      />

      <NumberInput
        label="Max Length"
        size="sm"
        min={options.gene_length_range.min}
        max={options.gene_length_range.max}
        value={filters.maxLength ?? options.gene_length_range.max}
        onChange={(value) => onChange({ ...filters, maxLength: value as number })}
      />
    </Stack>
  );
};

export default GeneFilters;