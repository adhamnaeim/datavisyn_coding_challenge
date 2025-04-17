# Human Genes Viewer

A simple fullstack web application to explore and visualize human gene data using:

- **Backend**: FastAPI (Python), serving data from a CSV
- **Frontend**: React + TypeScript + Mantine UI
- **Deployment**: Local development using Uvicorn and Vite

---

## Project Structure

```
gene_app/
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── data/
│   │   └── genes_human.csv
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GeneTable.tsx
│   │   │   ├── GeneFilters.tsx
│   │   │   ├── GeneStats.tsx
│   │   │   └── GeneCharts.tsx
│   │   ├── api/
│   │   │   └── genes.ts
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

---

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

---

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

- `GET /genes`: Filter, paginate, and sort gene records
- `GET /genes/{id}`: Retrieve individual gene by Ensembl ID
- `GET /genes/stats`: Summary stats (total, lengths, biotype dist.)
- `GET /genes/filters`: Fetch all valid filter options (UI-friendly)


## Testing

```bash
cd backend
PYTHONPATH=. pytest tests/
```
