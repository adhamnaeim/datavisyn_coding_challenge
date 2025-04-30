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