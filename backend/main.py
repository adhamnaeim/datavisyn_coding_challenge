from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import genes

app = FastAPI(title="Human Genes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(genes.router)