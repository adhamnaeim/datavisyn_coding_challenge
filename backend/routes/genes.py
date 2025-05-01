from fastapi import APIRouter, HTTPException, Query, Body
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
from models.gene import Gene
from services.gene_data import (
    get_filtered_genes,
    get_gene_by_id,
    get_gene_stats,
    get_filter_options,
    append_genes_to_csv,
)

router = APIRouter()

@router.get("/genes", response_model=Dict[str, Any])
def read_genes(
    limit: Optional[int] = None,
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

@router.get("/genes/filters")
def read_filter_options():
    return get_filter_options()

@router.get("/genes/stats")
def read_gene_stats():
    return get_gene_stats()

@router.get("/genes/{ensembl_id}", response_model=Gene)
def read_gene_by_id(ensembl_id: str):
    gene = get_gene_by_id(ensembl_id)
    if not gene:
        raise HTTPException(status_code=404, detail="Gene not found")
    return gene

@router.post("/genes")
def add_genes(new_genes: List[Gene] = Body(...)):
    try:
        append_genes_to_csv(new_genes)
        return {"status": "success", "added": len(new_genes)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
