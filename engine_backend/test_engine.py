from core.pipeline import RecommendationEngine
from core.models import RecommendationRequest

def test():
    print("Testing Engine Pipeline...")
    engine = RecommendationEngine.get_instance()
    
    print("\n--- 1. Testing Autocomplete Search ---")
    results = engine.search_movies("toy story", limit=3)
    for r in results:
        print(f"Found: {r.title} ({r.release_year}) - Poster: {r.poster_url}")

    print("\n--- 2. Testing Single-Seed Recommendation ---")
    req = RecommendationRequest(
        seeds=["Toy Story"],
        similarity_weight=0.7,
        min_rating=6.5,
        limit=5
    )
    res = engine.recommend(req)
    print(f"Got {len(res.recommendations)} recommendations for {res.seeds}:")
    for m in res.recommendations:
        print(f"👉 [{m.match_percentage}% Match] {m.title} ({m.release_year}) - Rating: {m.vote_average}★ - Reasons: {m.explainability}")
        print(f"   Poster: {m.poster_url}")

    print("\n--- 3. Testing Multi-Seed Recommendation (Taste Profile) ---")
    req2 = RecommendationRequest(
        seeds=["Toy Story", "Monsters, Inc."],
        similarity_weight=0.6,
        limit=5
    )
    res2 = engine.recommend(req2)
    print(f"Got {len(res2.recommendations)} recommendations for {res2.seeds}:")
    for m in res2.recommendations:
        print(f"👉 [{m.match_percentage}% Match] {m.title} ({m.release_year}) - Rating: {m.vote_average}★")

    print("\n✅ All Engine Tests Passed Successfully!")

if __name__ == "__main__":
    test()
