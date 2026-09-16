from typing import List, Optional
from pydantic import BaseModel, Field

class MovieItem(BaseModel):
    id: Optional[str] = None
    title: str
    overview: Optional[str] = ""
    genres: List[str] = []
    tagline: Optional[str] = ""
    vote_average: float = 0.0
    vote_count: int = 0
    release_date: Optional[str] = ""
    release_year: Optional[int] = None
    poster_path: Optional[str] = None
    poster_url: Optional[str] = None
    popularity: float = 0.0
    similarity_score: float = 0.0
    bayesian_rating: float = 0.0
    final_score: float = 0.0
    match_percentage: int = 0
    explainability: List[str] = []

class RecommendationRequest(BaseModel):
    seeds: List[str] = Field(..., min_items=1, description="One or more movie titles as taste seeds")
    similarity_weight: float = Field(0.65, ge=0.0, le=1.0, description="Weight for similarity vs Bayesian quality (1.0 = pure similarity, 0.0 = pure quality)")
    min_rating: float = Field(0.0, ge=0.0, le=10.0, description="Minimum IMDb vote average")
    min_votes: int = Field(20, ge=0, description="Minimum vote count threshold")
    genres: List[str] = Field(default_factory=list, description="Filter to any of these genres")
    year_min: Optional[int] = Field(None, ge=1900, le=2030)
    year_max: Optional[int] = Field(None, ge=1900, le=2030)
    limit: int = Field(12, ge=1, le=50)

class RecommendationResponse(BaseModel):
    seeds: List[str]
    total_matches: int
    recommendations: List[MovieItem]

class SearchResult(BaseModel):
    title: str
    release_year: Optional[int] = None
    vote_average: float = 0.0
    poster_url: Optional[str] = None
    genres: List[str] = []
