import React from 'react';

export type Gene = {
  ensembl: string;
  gene_symbol?: string;
  name?: string;
  biotype?: string;
  chromosome: string;
  start: number;
  end: number;
  gene_length: number;
};

type Props = {
  genes: Gene[];
  sort?: string;
  order?: 'asc' | 'desc';
  onSortChange: (field: string) => void;
};

const GeneTable: React.FC<Props> = ({ genes, sort, order, onSortChange }) => {
  const renderHeader = (label: string, field: string) => {
    const isSorted = sort === field;
    const arrow = isSorted ? (order === 'asc' ? ' ▲' : ' ▼') : '';
    return (
      <th onClick={() => onSortChange(field)} style={{ cursor: 'pointer' }}>
        {label}{arrow}
      </th>
    );
  };

  return (
    <table>
      <thead>
        <tr>
          {renderHeader("Ensembl", "ensembl")}
          {renderHeader("Symbol", "gene_symbol")}
          {renderHeader("Name", "name")}
          {renderHeader("Biotype", "biotype")}
          {renderHeader("Chromosome", "chromosome")}
          {renderHeader("Start", "start")}
          {renderHeader("End", "end")}
          {renderHeader("Gene Length", "gene_length")}
        </tr>
      </thead>
      <tbody>
        {genes.map((gene) => (
          <tr key={gene.ensembl}>
            <td>{gene.ensembl}</td>
            <td>{gene.gene_symbol || '-'}</td>
            <td>{gene.name || '-'}</td>
            <td>{gene.biotype || '-'}</td>
            <td>{gene.chromosome}</td>
            <td>{gene.start}</td>
            <td>{gene.end}</td>
            <td>{gene.gene_length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GeneTable;
