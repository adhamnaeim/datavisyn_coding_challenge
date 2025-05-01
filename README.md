# Human Genes Viewer

An interactive web application to explore human gene data, with support for sorting, filtering, search, statistics, and visual analysis. Data is loaded from a CSV file (`data/genes_human.csv`) and served using a FastAPI backend with a React frontend styled using Mantine.

- **Backend**: FastAPI (Python), serving data from a CSV
- **Frontend**: React + TypeScript + Mantine UI
- **Deployment**: Local development using Uvicorn

## Features

- Searchable and sortable table of gene records
- Filter by chromosome, biotype, and gene length
- Highlight search matches with optional filtering
- Per-record detail drawer
- Persistent selection of records with summary drawer
- Export filtered, selected, or full dataset as CSV
- Add new gene records with form validation and CSV persistence
- Live gene stats (total genes, unique chromosomes, length metrics, missing data)
- GeneCharts showing biotype distributions and length histograms
- Visualization of selected genes inside a nested drawer
- Theme toggle (light/dark)
- State persisted in local storage for selections


## Project Structure

```
.
├── backend/
│   ├── main.py
│   ├── routes/
│   │   └── genes.py
│   ├── services/
│   │   └── gene_data.py
│   ├── models/
│   │   └── gene.py
│   ├── utils/
│   │   └── import_csv.py
│   ├── data/
│   │   └── genes_human.csv
│   └── tests/
│       └── test_genes.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GeneTable.tsx
│   │   │   ├── GeneFilters.tsx
│   │   │   ├── GeneStats.tsx
│   │   │   ├── GeneCharts.tsx
│   │   │   ├── AddGeneForm.tsx
│   │   │   ├── detailRow.tsx
│   │   │   └── ExportWarningPopover.tsx
│   │   ├── types/
│   │   │   └── gene.ts
│   │   └── App.tsx
└── README.md
```

## Getting Started

### Docker Deployment Instructions (Optional)

1. From the root of the project:
   ```bash
   docker-compose up --build
   ```
2. Access the app:
    - Frontend: http://localhost:3000
    - Backend:  http://localhost:8000

1. To rebuild after code changes:
   ```bash
    docker-compose down
    docker-compose up --build
   ````
---
### Backend (FastAPI)
1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   ```

2. Install dependencies:
   ```bash   
   cd backend
   pip install -r requirements.txt
   ```

3. Run the API server:
   ```bash
   uvicorn main:app --reload
   ```

By default, the API runs at: `http://localhost:8000`


### Frontend (React + TypeScript)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm start
   ```

Frontend runs at: `http://localhost:3000`

## Features

- Loads and displays human gene data from a CSV
- Responsive UI with Mantine components
- RESTful API with filtering, sorting, and pagination
- Search genes by symbol, name, or Ensembl ID
- Dynamic filtering options (chromosome, biotype, gene length)
- Sortable and paginated data table
- Interactive charts (bar, pie, histogram, box plot) using Plotly
- Toggle between partial and full dataset visualization
- Real-time stat cards for dataset summaries
- button toggle for dark mode
- Smooth animations and visual transitions (table collapse, chart slides)

## API Highlights

- `GET /genes`: Fetch gene records with support for limit, offset, search, filtering, and sorting
- `GET /genes/{ensembl_id}`: Fetch a single gene by Ensembl ID
- `GET /genes/filters`: Get available chromosome and biotype values
- `GET /genes/stats`: Return dataset statistics including null counts
- `POST /genes`: Add one or multiple new gene records (updates CSV in-place)

## Testing

```bash
cd backend
PYTHONPATH=. pytest tests/
```
Located in `backend/tests/test_genes.py` using FastAPI’s `TestClient`:

- Basic fetching with limit (`test_get_genes_basic`)
- Filtered fetching by chromosome and biotype
- Fetching by valid and invalid Ensembl IDs
- Validity of stats and filter endpoints
- Edge cases (invalid filters, nonexistent IDs)
- Adding gene rows (duplicate check, invalid length)
