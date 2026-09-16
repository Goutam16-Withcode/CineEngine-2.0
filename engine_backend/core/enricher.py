import os
import pickle
import ast
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGINAL_DIR = os.path.join(os.path.dirname(BASE_DIR), "Movie recommendation")
CACHE_DIR = os.path.join(BASE_DIR, "data")
ENRICHED_DF_PATH = os.path.join(CACHE_DIR, "enriched_movies.pkl")
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

def parse_genres(genre_val):
    if not genre_val or pd.isna(genre_val):
        return []
    if isinstance(genre_val, list):
        return [g.strip() for g in genre_val if isinstance(g, str)]
    if isinstance(genre_val, str):
        # Could be "['Action', 'Comedy']" or string representation of list of dicts
        try:
            val = ast.literal_eval(genre_val)
            if isinstance(val, list):
                if len(val) > 0 and isinstance(val[0], dict):
                    return [d.get('name', '') for d in val if 'name' in d]
                return [str(x) for x in val]
        except Exception:
            # Maybe comma-separated string
            return [g.strip() for g in genre_val.replace('[', '').replace(']', '').replace("'", '').split(',') if g.strip()]
    return []

def extract_year(date_str):
    if not date_str or pd.isna(date_str):
        return None
    try:
        parts = str(date_str).split('-')
        if len(parts) >= 1 and len(parts[0]) == 4 and parts[0].isdigit():
            return int(parts[0])
    except Exception:
        pass
    return None

def build_or_load_enriched_dataset():
    os.makedirs(CACHE_DIR, exist_ok=True)
    if os.path.exists(ENRICHED_DF_PATH):
        try:
            with open(ENRICHED_DF_PATH, "rb") as f:
                return pickle.load(f)
        except Exception:
            pass

    print("[Enricher] Building enriched dataset from metadata...")
    df_path = os.path.join(ORIGINAL_DIR, "movies_df.pkl")
    meta_path = os.path.join(ORIGINAL_DIR, "movies_metadata.csv")

    with open(df_path, "rb") as f:
        movies_df = pickle.load(f)

    # Read needed columns from metadata CSV
    meta_cols = ['title', 'poster_path', 'vote_count', 'release_date', 'id']
    try:
        meta_df = pd.read_csv(meta_path, usecols=lambda c: c in meta_cols, low_memory=False)
        # Drop rows where title is null
        meta_df = meta_df.dropna(subset=['title'])
        meta_df['vote_count'] = pd.to_numeric(meta_df['vote_count'], errors='coerce').fillna(0).astype(int)
        
        # In case of duplicate titles, keep the one with the highest vote_count
        meta_df = meta_df.sort_values(by='vote_count', ascending=False).drop_duplicates(subset=['title'], keep='first')
        
        # Merge on title
        enriched = pd.merge(movies_df, meta_df, on='title', how='left')
    except Exception as e:
        print(f"[Enricher Warning] Could not read metadata CSV: {e}")
        enriched = movies_df.copy()
        if 'poster_path' not in enriched.columns:
            enriched['poster_path'] = None
        if 'vote_count' not in enriched.columns:
            enriched['vote_count'] = 0
        if 'release_date' not in enriched.columns:
            enriched['release_date'] = None
        if 'id' not in enriched.columns:
            enriched['id'] = None

    # Parse and clean genres
    enriched['genres_list'] = enriched['genres'].apply(parse_genres)
    
    # Extract clean release year
    enriched['release_year'] = enriched['release_date'].apply(extract_year)
    
    # Format full poster URL
    def format_poster(p):
        if isinstance(p, str) and p.strip().startswith('/'):
            return f"{TMDB_IMAGE_BASE}{p.strip()}"
        return None
    enriched['poster_url'] = enriched['poster_path'].apply(format_poster)
    
    # Ensure numeric types
    enriched['vote_average'] = pd.to_numeric(enriched['vote_average'], errors='coerce').fillna(0.0)
    enriched['vote_count'] = pd.to_numeric(enriched['vote_count'], errors='coerce').fillna(0).astype(int)
    enriched['popularity'] = pd.to_numeric(enriched['popularity'], errors='coerce').fillna(0.0)

    # Precalculate Bayesian IMDb Weighted Rating
    # Formula: WR = (v / (v + m)) * R + (m / (v + m)) * C
    C = enriched['vote_average'].mean()
    # 80th percentile minimum votes for stability
    m = enriched[enriched['vote_count'] > 0]['vote_count'].quantile(0.80)
    if pd.isna(m) or m <= 0:
        m = 50.0

    def compute_wr(row):
        v = row['vote_count']
        R = row['vote_average']
        if v + m > 0:
            return (v / (v + m)) * R + (m / (v + m)) * C
        return R

    enriched['bayesian_rating'] = enriched.apply(compute_wr, axis=1)

    # Save to cache
    with open(ENRICHED_DF_PATH, "wb") as f:
        pickle.dump(enriched, f)

    print(f"[Enricher] Enriched dataset created successfully: {len(enriched)} movies saved.")
    return enriched

if __name__ == "__main__":
    df = build_or_load_enriched_dataset()
    print("Columns:", df.columns.tolist())
    print(df[['title', 'release_year', 'vote_average', 'vote_count', 'bayesian_rating', 'poster_url']].head(3))
