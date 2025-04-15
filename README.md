
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
│   └── genes_human.csv
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

## 🚀 Getting Started

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
