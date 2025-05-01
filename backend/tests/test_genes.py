from fastapi.testclient import TestClient
from main import app
import csv
import os

client = TestClient(app)
TEST_ENSEMBL_ID = "TEST_GENE_12345"


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
    response = client.get("/genes/ENSG00000139618")
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

def test_add_gene_success():
    payload = [{
        "ensembl": TEST_ENSEMBL_ID,
        "gene_symbol": "TST",
        "name": "TestGene",
        "biotype": "ProteinCoding",
        "chromosome": "1",
        "start": 100,
        "end": 200,
        "gene_length": 100
    }]
    response = client.post("/genes", json=payload)
    assert response.status_code == 200 or response.status_code == 201
    data = response.json()
    assert "status" in data and data["status"] == "success"

def test_add_gene_duplicate():
    payload = [{
        "ensembl": TEST_ENSEMBL_ID,
        "gene_symbol": "TST",
        "name": "TestGene",
        "biotype": "ProteinCoding",
        "chromosome": "1",
        "start": 100,
        "end": 200,
        "gene_length": 100
    }]
    response = client.post("/genes", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "error" in data and "Duplicate" in data["error"]

def test_add_gene_invalid_coordinates():
    payload = [{
        "ensembl": "TEST_BAD_COORD",
        "gene_symbol": "BAD",
        "name": "BadGene",
        "biotype": "ProteinCoding",
        "chromosome": "1",
        "start": 500,
        "end": 100,
        "gene_length": -400
    }]
    response = client.post("/genes", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert "error" in data and "Start must be less than End" in data["error"]

def teardown_module():
    csv_path = "data/genes_human.csv"
    temp_path = "data/genes_human_temp.csv"
    with open(csv_path, "r") as infile, open(temp_path, "w") as outfile:
        reader = csv.DictReader(infile, delimiter=';')
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        for row in reader:
            if row["Ensembl"] != TEST_ENSEMBL_ID:
                writer.writerow(row)
    os.replace(temp_path, csv_path)
