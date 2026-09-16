import os
import pickle
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.metrics.pairwise import linear_kernel
try:
    from .models import MovieItem, RecommendationRequest, RecommendationResponse, SearchResult
    from .enricher import build_or_load_enriched_dataset
except (ImportError, ValueError):
    from core.models import MovieItem, RecommendationRequest, RecommendationResponse, SearchResult
    from core.enricher import build_or_load_enriched_dataset

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINAL_DIR = os.path.join(os.path.dirname(BASE_DIR), "Movie recommendation")

class RecommendationEngine:
    _instance = None

    def __init__(self):
        print("[Engine] Initializing Recommendation Engine...")
        self.df = build_or_load_enriched_dataset()
        
        # Load TF-IDF matrix
        matrix_path = os.path.join(ORIGINAL_DIR, "tfidf_matrix.pkl")
        print(f"[Engine] Loading TF-IDF matrix from {matrix_path}...")
        with open(matrix_path, "rb") as f:
            self.tfidf_matrix = pickle.load(f)

        # Load indices mapping
        indices_path = os.path.join(ORIGINAL_DIR, "indices.pkl")
        with open(indices_path, "rb") as f:
            self.indices = pickle.load(f)

        # Build fast lowercase title map for robust fuzzy matching
        print("[Engine] Building lookup indices...")
        self.title_map = {}
        for title in self.df['title'].dropna().unique():
            self.title_map[title.strip().lower()] = title

        # Precompute popular high-rated movies for cold-start / surprise
        high_rated = self.df[(self.df['vote_count'] >= 50) & (self.df['vote_average'] >= 7.0)]
        self.popular_gems = high_rated.sort_values(by='bayesian_rating', ascending=False)
        print(f"[Engine] Engine ready with {len(self.df)} movies!")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _get_single_index(self, title: str) -> Optional[int]:
        """Resolves movie title to a safe integer index in the matrix."""
        # Exact match in indices
        if title in self.indices:
            idx = self.indices[title]
            if isinstance(idx, (list, tuple, np.ndarray, pd.Series)):
                return int(idx[0])
            return int(idx)
        
        # Lowercase match
        clean_title = title.strip().lower()
        if clean_title in self.title_map:
            real_title = self.title_map[clean_title]
            if real_title in self.indices:
                idx = self.indices[real_title]
                if isinstance(idx, (list, tuple, np.ndarray, pd.Series)):
                    return int(idx[0])
                return int(idx)
        return None

    def search_movies(self, query: str, limit: int = 10) -> List[SearchResult]:
        if not query or len(query.strip()) == 0:
            return []
        
        q = query.strip().lower()
        # Fast prefix match followed by substring match
        matches = self.df[self.df['title'].str.lower().str.contains(q, na=False, regex=False)]
        # Sort by popularity or vote_count
        matches = matches.sort_values(by='vote_count', ascending=False).head(limit)
        
        results = []
        for _, row in matches.iterrows():
            results.append(SearchResult(
                title=str(row['title']),
                release_year=row['release_year'] if pd.notna(row.get('release_year')) else None,
                vote_average=float(row.get('vote_average', 0.0)),
                poster_url=row.get('poster_url'),
                genres=row.get('genres_list', [])
            ))
        return results

    def get_genres(self) -> List[Dict[str, Any]]:
        # Count frequency of each genre
        genre_counts = {}
        for genres in self.df['genres_list']:
            for g in genres:
                if g:
                    genre_counts[g] = genre_counts.get(g, 0) + 1
        # Sort by frequency
        sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
        return [{"name": g, "count": c} for g, c in sorted_genres if c > 50]

    def get_surprise_movie(self) -> MovieItem:
        sample = self.popular_gems.sample(1).iloc[0]
        return self._row_to_movie_item(sample, match_pct=95, reasons=["Curated Hidden Gem", "High Critical Acclaim"])

    def recommend(self, req: RecommendationRequest) -> RecommendationResponse:
        seed_indices = []
        valid_seed_titles = []

        for seed in req.seeds:
            idx = self._get_single_index(seed)
            if idx is not None and 0 <= idx < self.tfidf_matrix.shape[0]:
                seed_indices.append(idx)
                valid_seed_titles.append(self.df['title'].iloc[idx])

        if not seed_indices:
            return RecommendationResponse(seeds=req.seeds, total_matches=0, recommendations=[])

        # Stage 1: Candidate Generation / Vector Similarity
        if len(seed_indices) == 1:
            query_vector = self.tfidf_matrix[seed_indices[0]]
        else:
            # Multi-seed: aggregate taste profile vector
            vectors = [self.tfidf_matrix[i] for i in seed_indices]
            query_vector = sum(vectors) / len(vectors)

        sim_scores = linear_kernel(query_vector, self.tfidf_matrix).flatten()

        # Retrieve top 300 candidates
        top_indices = np.argsort(sim_scores)[::-1]
        
        # Exclude seed movies
        seed_set = set(seed_indices)
        candidate_indices = [i for i in top_indices if i not in seed_set and 0 <= i < len(self.df)][:300]
        
        candidates_df = self.df.iloc[candidate_indices].copy()
        candidates_df['sim_score'] = sim_scores[candidate_indices]

        # Stage 2: Quality Reranker & Composite Scoring
        # Similarity is between 0 and 1, Bayesian rating is 0 to 10 (normalized to 0 to 1)
        w_sim = req.similarity_weight
        w_qual = 1.0 - w_sim
        
        candidates_df['norm_bayes'] = candidates_df['bayesian_rating'] / 10.0
        candidates_df['final_score'] = (w_sim * candidates_df['sim_score']) + (w_qual * candidates_df['norm_bayes'])

        # Stage 3: Filtering (User Constraints)
        filtered = candidates_df

        if req.min_rating > 0:
            filtered = filtered[filtered['vote_average'] >= req.min_rating]

        if req.min_votes > 0:
            filtered = filtered[filtered['vote_count'] >= req.min_votes]

        if req.genres and len(req.genres) > 0:
            req_genre_set = set(g.lower() for g in req.genres)
            filtered = filtered[filtered['genres_list'].apply(lambda gl: bool(set(g.lower() for g in gl) & req_genre_set))]

        if req.year_min is not None:
            filtered = filtered[filtered['release_year'] >= req.year_min]

        if req.year_max is not None:
            filtered = filtered[filtered['release_year'] <= req.year_max]

        # If filtering is too strict and leaves less than req.limit, fallback to candidates_df
        if len(filtered) < req.limit:
            filtered = candidates_df

        # Sort by final score
        ranked = filtered.sort_values(by='final_score', ascending=False).head(req.limit)

        # Stage 4: Explainability & Asset Construction
        recommendations = []
        seed_genres = set()
        for idx in seed_indices:
            seed_genres.update(self.df.iloc[idx].get('genres_list', []))

        for _, row in ranked.iterrows():
            sim = float(row['sim_score'])
            final = float(row['final_score'])
            # Normalized match percentage from 70% to 99% for top results
            match_pct = int(np.clip(55 + (sim * 80) + (row['bayesian_rating'] * 2.5), 65, 99))
            
            # Formulate explainability tags
            reasons = []
            common_genres = set(row.get('genres_list', [])) & seed_genres
            if common_genres:
                reasons.append(f"Shared Genre: {', '.join(list(common_genres)[:2])}")
            if sim > 0.2:
                reasons.append("High Plot & Theme Match")
            if row.get('vote_average', 0) >= 7.5 and row.get('vote_count', 0) >= 100:
                reasons.append(f"Acclaimed ({row['vote_average']}★ with {row['vote_count']} votes)")
            if not reasons:
                reasons.append("Semantic Taste Affinity")

            item = self._row_to_movie_item(row, match_pct=match_pct, reasons=reasons, sim_score=sim, final_score=final)
            recommendations.append(item)

        return RecommendationResponse(
            seeds=valid_seed_titles,
            total_matches=len(recommendations),
            recommendations=recommendations
        )

    def _row_to_movie_item(self, row: pd.Series, match_pct: int, reasons: List[str], sim_score: float = 0.0, final_score: float = 0.0) -> MovieItem:
        return MovieItem(
            id=str(row.get('id', '')) if pd.notna(row.get('id')) else None,
            title=str(row.get('title', 'Unknown')),
            overview=str(row.get('overview', '')) if pd.notna(row.get('overview')) else '',
            genres=row.get('genres_list', []),
            tagline=str(row.get('tagline', '')) if pd.notna(row.get('tagline')) else '',
            vote_average=float(row.get('vote_average', 0.0)),
            vote_count=int(row.get('vote_count', 0)),
            release_date=str(row.get('release_date', '')) if pd.notna(row.get('release_date')) else '',
            release_year=int(row['release_year']) if pd.notna(row.get('release_year')) else None,
            poster_path=str(row.get('poster_path', '')) if pd.notna(row.get('poster_path')) else None,
            poster_url=row.get('poster_url'),
            popularity=float(row.get('popularity', 0.0)),
            similarity_score=round(sim_score, 4),
            bayesian_rating=round(float(row.get('bayesian_rating', 0.0)), 2),
            final_score=round(final_score, 4),
            match_percentage=match_pct,
            explainability=reasons
        )
