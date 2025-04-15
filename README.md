
# Human Genes Viewer

A simple fullstack web application to explore and visualize human gene data using:

- **Backend**: FastAPI (Python), serving data from a CSV
- **Frontend**: React + TypeScript
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
    ├── data/
│       ├── genes_human.csv
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── GeneTable.tsx
│   │   ├── api/
│   │   │   └── genes.ts
│   │   └── App.tsx
└── README.md
```

---

## Getting Started

### Backend (FastAPI)
1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the API server:
   ```bash
   cd backend
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
- RESTful API with filtering, sorting, and pagination
- Search genes by name or symbol
- Stats endpoint to summarize dataset features
- Dynamic filtering options (biotype, chromosome, length range)
- Unit tested with edge cases
- CSV-based architecture for simplicity and demo-readiness

---

## API Highlights

- `GET /genes`: Filter, paginate, and sort gene records
- `GET /genes/{id}`: Retrieve individual gene by Ensembl ID
- `GET /genes/stats`: Summary stats (total, lengths, biotype dist.)
- `GET /genes/filters`: Fetch all valid filter options (UI-friendly)

---

## Testing

```bash
cd backend
PYTHONPATH=. pytest tests/
```
