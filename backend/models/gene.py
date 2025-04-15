from pydantic import BaseModel
from typing import Optional

class Gene(BaseModel):
    ensembl: str
    gene_symbol: Optional[str] = None
    name: Optional[str] = None
    biotype: Optional[str] = None
    chromosome: str
    start: int
    end: int
    gene_length: int