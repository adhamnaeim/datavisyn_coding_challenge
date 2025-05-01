import pandas as pd
from typing import List, Optional, Dict, Any, Tuple
from models.gene import Gene

# Load and preprocess data
df = pd.read_csv("data/genes_human.csv", delimiter=';')
df = df.dropna(subset=['Ensembl', 'Chromosome', 'Seq region start', 'Seq region end'])

for col in ['Biotype', 'Chromosome']:
    df[col] = df[col].astype(str).str.strip().str.replace(' ', '').str.title()

df['GeneLength'] = df['Seq region end'] - df['Seq region start']

def load_csv() -> pd.DataFrame:
    df = pd.read_csv("data/genes_human.csv", delimiter=';')
    df = df.dropna(subset=['Ensembl', 'Chromosome', 'Seq region start', 'Seq region end'])
    for col in ['Biotype', 'Chromosome']:
        df[col] = df[col].astype(str).str.strip().str.replace(' ', '').str.title()
    df['GeneLength'] = df['Seq region end'] - df['Seq region start']
    return df

def safe_str(val):
    return str(val) if pd.notna(val) else None

def get_filtered_genes(
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    chromosome: Optional[str] = None,
    biotype: Optional[str] = None,
    min_length: Optional[int] = None,
    max_length: Optional[int] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    order: Optional[str] = "asc"
) -> Tuple[int, List[Gene]]:
    df = load_csv()
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
            filtered_df['Name'].astype(str).str.contains(search, case=False, na=False) |
            filtered_df['Ensembl'].astype(str).str.contains(search, case=False, na=False) |
            filtered_df['Biotype'].astype(str).str.contains(search, case=False, na=False)
        ]

    total = len(filtered_df)

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

    if limit is not None:
        filtered_df = filtered_df.iloc[offset or 0 : (offset or 0) + limit]

    genes = [
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
        for _, row in filtered_df.iterrows()
    ]

    return total, genes

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

def get_gene_stats() -> Dict[str, Any]:
    df = load_csv()
    null_counts = {
        "gene_symbol": int(df['Gene symbol'].isna().sum()),
        "name": int(df['Name'].isna().sum()),
        "biotype": int(df['Biotype'].isna().sum()),
        "chromosome": int(df['Chromosome'].isna().sum()),
    }
    return {
        "total_genes": len(df),
        "unique_chromosomes": df['Chromosome'].nunique(),
        "top_biotypes": df['Biotype'].value_counts().head(5).to_dict(),
        "gene_length": {
            "min": int(df['GeneLength'].min()),
            "max": int(df['GeneLength'].max()),
            "mean": int(df['GeneLength'].mean())
        },
        "null_counts": null_counts,

    }

def get_filter_options() -> Dict[str, Any]:
    df = load_csv()
    return {
        "chromosomes": sorted(df['Chromosome'].dropna().unique().tolist()),
        "biotypes": sorted(df['Biotype'].dropna().unique().tolist()),
        "gene_length_range": {
            "min": int(df['GeneLength'].min()),
            "max": int(df['GeneLength'].max())
        }
    }
    
def append_genes_to_csv(new_genes: List[Gene], csv_path: str = "data/genes_human.csv") -> None:
    df_existing = pd.read_csv(csv_path, delimiter=';')
    existing_ids = set(df_existing["Ensembl"].astype(str))

    new_rows = []
    for gene in new_genes:
        if gene.ensembl in existing_ids:
            raise ValueError(f"Duplicate Ensembl ID: {gene.ensembl}")
        if gene.start >= gene.end:
            raise ValueError(f"Start must be less than End for {gene.ensembl}")

        new_rows.append({
            "Ensembl": gene.ensembl,
            "Gene symbol": gene.gene_symbol or '',
            "Name": gene.name or '',
            "Biotype": gene.biotype or '',
            "Chromosome": gene.chromosome,
            "Seq region start": gene.start,
            "Seq region end": gene.end,
            "GeneLength": gene.gene_length,
        })

    df_new = pd.DataFrame(new_rows)
    df_combined = pd.concat([df_existing, df_new], ignore_index=True)
    df_combined.to_csv(csv_path, sep=';', index=False)
