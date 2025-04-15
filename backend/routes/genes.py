from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from models.gene import Gene
from services.gene_data import get_filtered_genes, get_gene_by_id, get_gene_stats

router = APIRouter()

@router.get("/genes", response_model=Dict[str, Any])
def read_genes(
    limit: int = 100,
    offset: int = 0,
    chromosome: Optional[str] = Query(None),
    biotype: Optional[str] = Query(None),
    min_length: Optional[int] = Query(None),
    max_length: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    order: Optional[str] = Query("asc")
):
    total, results = get_filtered_genes(
        limit=limit,
        offset=offset,
        chromosome=chromosome,
        biotype=biotype,
        min_length=min_length,
        max_length=max_length,
        search=search,
        sort=sort,
        order=order
    )
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "results": results
    }

@router.get("/genes/stats")
def read_gene_stats():
    return get_gene_stats()

@router.get("/genes/{ensembl_id}", response_model=Gene)
def read_gene_by_id(ensembl_id: str):
    gene = get_gene_by_id(ensembl_id)
    if not gene:
        raise HTTPException(status_code=404, detail="Gene not found")
    return gene
