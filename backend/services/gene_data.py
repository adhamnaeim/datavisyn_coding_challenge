import pandas as pd
from typing import List, Optional
from models.gene import Gene

# Load and preprocess data
df = pd.read_csv("data/genes_human.csv", delimiter=';')
df = df.dropna(subset=['Ensembl', 'Chromosome', 'Seq region start', 'Seq region end'])

for col in ['Biotype', 'Chromosome']:
    df[col] = df[col].astype(str).str.strip().str.replace(' ', '').str.title()

df['GeneLength'] = df['Seq region end'] - df['Seq region start']

def safe_str(val):
    return str(val) if pd.notna(val) else None

def get_filtered_genes(
    limit: int = 100,
    offset: int = 0,
    chromosome: Optional[str] = None,
    biotype: Optional[str] = None,
    min_length: Optional[int] = None,
    max_length: Optional[int] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    order: Optional[str] = "asc"
) -> List[Gene]:
    filtered_df = df.copy()

    if chromosome:
        filtered_df = filtered_df[filtered_df['Chromosome'].str.upper() == chromosome.upper()]
    if biotype:
        filtered_df = filtered_df[filtered_df['Biotype'].str.lower() == biotype.lower()]
    if min_length is not None:
        filtered_df = filtered_df[filtered_df['GeneLength'] >= min_length]
    if max_length is not None:
        filtered_df = filtered_df[filtered_df['GeneLength'] <= max_length]
    if search:
        filtered_df = filtered_df[
            filtered_df['Gene symbol'].astype(str).str.contains(search, case=False, na=False) |
            filtered_df['Name'].astype(str).str.contains(search, case=False, na=False)
        ]

    if sort in ['ensembl', 'gene_symbol', 'name', 'biotype', 'chromosome', 'start', 'end', 'gene_length']:
        sort_map = {
            'ensembl': 'Ensembl',
            'gene_symbol': 'Gene symbol',
            'name': 'Name',
            'biotype': 'Biotype',
            'chromosome': 'Chromosome',
            'start': 'Seq region start',
            'end': 'Seq region end',
            'gene_length': 'GeneLength',
        }
        filtered_df = filtered_df.sort_values(by=sort_map[sort], ascending=(order != "desc"))

    result = filtered_df.iloc[offset:offset+limit]

    return [
        Gene(
            ensembl=row['Ensembl'],
            gene_symbol=safe_str(row['Gene symbol']),
            name=safe_str(row['Name']),
            biotype=safe_str(row['Biotype']),
            chromosome=row['Chromosome'],
            start=int(row['Seq region start']),
            end=int(row['Seq region end']),
            gene_length=int(row['GeneLength'])
        )
        for _, row in result.iterrows()
    ]

def get_gene_by_id(ensembl_id: str) -> Optional[Gene]:
    row = df[df['Ensembl'] == ensembl_id]
    if row.empty:
        return None
    row = row.iloc[0]
    return Gene(
        ensembl=row['Ensembl'],
        gene_symbol=safe_str(row['Gene symbol']),
        name=safe_str(row['Name']),
        biotype=safe_str(row['Biotype']),
        chromosome=row['Chromosome'],
        start=int(row['Seq region start']),
        end=int(row['Seq region end']),
        gene_length=int(row['GeneLength'])
    )
