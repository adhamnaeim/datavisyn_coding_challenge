import React from 'react';
import { Table, ScrollArea } from '@mantine/core';

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
  search?: string;
};

const highlight = (text: string, term?: string) => {
  if (!term || !text.toLowerCase().includes(term.toLowerCase())) return text;
  const regex = new RegExp(`(${term})`, 'ig');
  return (
    <span dangerouslySetInnerHTML={{ __html: text.replace(regex, '<mark>$1</mark>') }} />
  );
};

const GeneTable: React.FC<Props> = ({ genes, sort, order, onSortChange, search }) => {
  const renderHeader = (label: string, field: string) => {
    const isSorted = sort === field;
    const arrow = isSorted ? (order === 'asc' ? ' ▲' : ' ▼') : '';
    return (
      <th onClick={() => onSortChange(field)} style={{ cursor: 'pointer' }}>
        {label}{arrow}
      </th>
    );
  };

  const rows = genes.map((gene) => (
    <tr key={gene.ensembl}>
      <td>{highlight(gene.ensembl, search)}</td>
      <td>{gene.gene_symbol ? highlight(gene.gene_symbol, search) : '-'}</td>
      <td>{gene.name ? highlight(gene.name, search) : '-'}</td>
      <td>{gene.biotype || '-'}</td>
      <td>{gene.chromosome}</td>
      <td>{gene.start}</td>
      <td>{gene.end}</td>
      <td>{gene.gene_length}</td>
    </tr>
  ));

  return (
    <ScrollArea>
        <Table
            striped
            highlightOnHover
            withBorder
            withColumnBorders
        >
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
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};

export default GeneTable;