from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Human Genes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv("genes_human.csv", delimiter=';')

class Gene(BaseModel):
    ensembl: str
    gene_symbol: Optional[str] = None
    name: Optional[str] = None
    biotype: Optional[str] = None
    chromosome: str
    start: int
    end: int

processed_genes = [
    Gene(
        ensembl=row['Ensembl'],
        gene_symbol=row['Gene symbol'] if pd.notna(row['Gene symbol']) else None,
        name=row['Name'] if pd.notna(row['Name']) else None,
        biotype=row['Biotype'] if pd.notna(row['Biotype']) else None,
        chromosome=row['Chromosome'],
        start=int(row['Seq region start']),
        end=int(row['Seq region end'])
    )
    for _, row in df.iterrows()
]

@app.get("/genes", response_model=List[Gene])
def get_genes(limit: int = 100):
    return processed_genes[:limit]

@app.get("/genes/{ensembl_id}", response_model=Gene)
def get_gene_by_ensembl(ensembl_id: str):
    for gene in processed_genes:
        if gene.ensembl == ensembl_id:
            return gene
    raise HTTPException(status_code=404, detail="Gene not found")
