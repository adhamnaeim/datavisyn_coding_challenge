from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.gene import Gene
from services.gene_data import get_filtered_genes, get_gene_by_id

router = APIRouter()

@router.get("/genes", response_model=List[Gene])
def read_genes(
    limit: int = 100,
    offset: int = 0,
    chromosome: Optional[str] = Query(None),
    biotype: Optional[str] = Query(None)
):
    return get_filtered_genes(limit=limit, offset=offset, chromosome=chromosome, biotype=biotype)


@router.get("/genes/{ensembl_id}", response_model=Gene)
def read_gene_by_id(ensembl_id: str):
    gene = get_gene_by_id(ensembl_id)
    if not gene:
        raise HTTPException(status_code=404, detail="Gene not found")
    return gene
