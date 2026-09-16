import os
import sys

# Ensure current directory is in sys.path for direct python run.py execution
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

try:
    from core.pipeline import RecommendationEngine
    from core.models import RecommendationRequest, RecommendationResponse, SearchResult, MovieItem
except (ImportError, ValueError):
    from .core.pipeline import RecommendationEngine
    from .core.models import RecommendationRequest, RecommendationResponse, SearchResult, MovieItem

app = FastAPI(
    title="Next-Gen Movie Recommendation Engine API",
    description="Multi-stage industrial recommendation pipeline with candidate retrieval, Bayesian reranking, and explainability.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = None

def get_engine() -> RecommendationEngine:
    global engine
    if engine is None:
        engine = RecommendationEngine.get_instance()
    return engine

@app.on_event("startup")
def startup_event():
    get_engine()

@app.get("/")
def root():
    return {"message": "CineEngine 2.0 API is running!", "docs": "/docs"}

@app.get("/api/health")
def health_check():
    eng = get_engine()
    return {
        "status": "healthy",
        "service": "Movie Recommendation Engine",
        "catalog_size": len(eng.df) if eng and eng.df is not None else 0
    }

@app.get("/api/search", response_model=List[SearchResult])
def search_movies(q: str = Query(..., min_length=1), limit: int = Query(8, ge=1, le=20)):
    eng = get_engine()
    return eng.search_movies(q, limit=limit)

@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    eng = get_engine()
    return eng.recommend(req)

@app.get("/api/genres")
def get_genres():
    eng = get_engine()
    return eng.get_genres()

@app.get("/api/surprise", response_model=MovieItem)
def get_surprise():
    eng = get_engine()
    return eng.get_surprise_movie()

@app.get("/api/popular", response_model=List[MovieItem])
def get_popular(limit: int = Query(12, ge=1, le=30)):
    eng = get_engine()
    top_gems = eng.popular_gems.head(limit)
    items = []
    for _, row in top_gems.iterrows():
        items.append(eng._row_to_movie_item(row, match_pct=98, reasons=["Trending Classic", "Top Rated"]))
    return items
