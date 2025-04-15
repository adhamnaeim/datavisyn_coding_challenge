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
};

const GeneTable: React.FC<Props> = ({ genes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Ensembl</th>
          <th>Symbol</th>
          <th>Name</th>
          <th>Biotype</th>
          <th>Chromosome</th>
          <th>Start</th>
          <th>End</th>
          <th>Gene Length</th>
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
