export interface MovieItem {
  id?: string;
  title: string;
  overview: string;
  genres: string[];
  tagline?: string;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  release_year?: number;
  poster_path?: string;
  poster_url?: string;
  popularity: number;
  similarity_score: number;
  bayesian_rating: number;
  final_score: number;
  match_percentage: number;
  explainability: string[];
}

export interface SearchResult {
  title: string;
  release_year?: number;
  vote_average: number;
  poster_url?: string;
  genres: string[];
}

export interface RecommendationRequest {
  seeds: string[];
  similarity_weight: number;
  min_rating: number;
  min_votes: number;
  genres: string[];
  year_min?: number;
  year_max?: number;
  limit: number;
}

export interface RecommendationResponse {
  seeds: string[];
  total_matches: number;
  recommendations: MovieItem[];
}

export interface GenreOption {
  name: string;
  count: number;
}
