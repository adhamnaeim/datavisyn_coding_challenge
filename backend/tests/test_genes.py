from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_genes_basic():
    response = client.get("/genes?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) <= 5

def test_get_genes_with_filters():
    response = client.get("/genes?chromosome=17&biotype=Protein%20Coding")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert all(gene["chromosome"] == "17" for gene in data["results"])
    assert all(gene["biotype"].lower() == "protein coding".lower() for gene in data["results"])

def test_get_gene_by_id():
    response = client.get("/genes/ENSG00000139618")  # Example ID, should exist in real dataset
    if response.status_code == 200:
        data = response.json()
        assert data["ensembl"] == "ENSG00000139618"
    else:
        assert response.status_code == 404

def test_get_stats():
    response = client.get("/genes/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_genes" in data
    assert "gene_length" in data

def test_get_filters():
    response = client.get("/genes/filters")
    assert response.status_code == 200
    data = response.json()
    assert "chromosomes" in data
    assert "biotypes" in data
    assert "gene_length_range" in data

def test_invalid_chromosome_filter():
    response = client.get("/genes?chromosome=INVALID")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) == 0

def test_invalid_biotype_filter():
    response = client.get("/genes?biotype=MadeUpType")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) == 0

def test_nonexistent_ensembl_id():
    response = client.get("/genes/FAKE_ID_123456")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Gene not found"

def test_invalid_min_max_length():
    response = client.get("/genes?min_length=99999999")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) == 0
