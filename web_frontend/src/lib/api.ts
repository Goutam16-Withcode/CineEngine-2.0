import { MovieItem, SearchResult, RecommendationRequest, RecommendationResponse, GenreOption } from "../types/movie";

const API_ENDPOINTS = [
  process.env.NEXT_PUBLIC_ENGINE_API_URL,
  "/api/engine",
  "http://127.0.0.1:8000/api",
  "http://localhost:8000/api",
].filter(Boolean) as string[];

// Rich fallback catalog with genuine TMDB poster assets ensuring the UI is never blank
const CURATED_FALLBACK_MOVIES: MovieItem[] = [
  {
    id: "27205",
    title: "Inception",
    tagline: "Your mind is the scene of the crime.",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life in exchange for a nearly impossible task: inception.",
    genres: ["Action", "Science Fiction", "Adventure"],
    vote_average: 8.3,
    vote_count: 31000,
    release_date: "2010-07-15",
    release_year: 2010,
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    popularity: 88.5,
    similarity_score: 0.95,
    bayesian_rating: 8.25,
    final_score: 0.91,
    match_percentage: 98,
    explainability: ["Root Taste Seed", "Acclaimed Christopher Nolan Mind-Bender"],
  },
  {
    id: "157336",
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    genres: ["Adventure", "Drama", "Science Fiction"],
    vote_average: 8.4,
    vote_count: 32000,
    release_date: "2014-11-05",
    release_year: 2014,
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    popularity: 92.4,
    similarity_score: 0.88,
    bayesian_rating: 8.32,
    final_score: 0.89,
    match_percentage: 96,
    explainability: ["Shared Director & Cosmic Themes", "High Plot & Philosophy Overlap"],
  },
  {
    id: "155",
    title: "The Dark Knight",
    tagline: "Why So Serious?",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    genres: ["Drama", "Action", "Crime", "Thriller"],
    vote_average: 8.5,
    vote_count: 29000,
    release_date: "2008-07-16",
    release_year: 2008,
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    popularity: 98.1,
    similarity_score: 0.82,
    bayesian_rating: 8.45,
    final_score: 0.86,
    match_percentage: 94,
    explainability: ["High Critical Acclaim (8.5★)", "Intense Psychological Conflict"],
  },
  {
    id: "1124",
    title: "The Prestige",
    tagline: "A friendship that became a rivalry. A rivalry that became an obsession.",
    overview: "A mysterious story of two magicians whose intense rivalry leads them on a life-long battle for supremacy -- full of obsession, deceit and jealousy with dangerous and deadly consequences.",
    genres: ["Drama", "Mystery", "Thriller"],
    vote_average: 8.2,
    vote_count: 14000,
    release_date: "2006-10-19",
    release_year: 2006,
    poster_path: "/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
    popularity: 45.2,
    similarity_score: 0.85,
    bayesian_rating: 8.12,
    final_score: 0.84,
    match_percentage: 93,
    explainability: ["Masterclass in Plot Twists", "Shares Director Christopher Nolan"],
  },
  {
    id: "77",
    title: "Memento",
    tagline: "Some memories are best forgotten.",
    overview: "Leonard Shelby is tracking down the man who raped and murdered his wife. The difficulty of locating his wife's killer, however, is compounded by the fact that he suffers from a rare, untreatable form of short-term memory loss.",
    genres: ["Mystery", "Thriller"],
    vote_average: 8.2,
    vote_count: 13000,
    release_date: "2000-10-11",
    release_year: 2000,
    poster_path: "/yuNs09hvpHVU1cBTCA99Uh437k0.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCA99Uh437k0.jpg",
    popularity: 38.6,
    similarity_score: 0.81,
    bayesian_rating: 8.08,
    final_score: 0.82,
    match_percentage: 91,
    explainability: ["Non-Linear Narrative Architecture", "High Psychological Resonance"],
  },
  {
    id: "11324",
    title: "Shutter Island",
    tagline: "Someone is missing.",
    overview: "World War II soldier-turned-U.S. Marshal Teddy Daniels investigates the disappearance of a patient from Boston's Shutter Island Ashecliffe Hospital, uncovering shocking secrets.",
    genres: ["Drama", "Thriller", "Mystery"],
    vote_average: 8.2,
    vote_count: 21000,
    release_date: "2010-02-18",
    release_year: 2010,
    poster_path: "/kve20tXwUZpu4GUX8l6X7Z4QIY2.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/kve20tXwUZpu4GUX8l6X7Z4QIY2.jpg",
    popularity: 56.4,
    similarity_score: 0.79,
    bayesian_rating: 8.14,
    final_score: 0.81,
    match_percentage: 90,
    explainability: ["Psychological Mind Game", "Starring Leonardo DiCaprio"],
  },
  {
    id: "603",
    title: "The Matrix",
    tagline: "Welcome to the Real World.",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    genres: ["Action", "Science Fiction"],
    vote_average: 8.2,
    vote_count: 24000,
    release_date: "1999-03-30",
    release_year: 1999,
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    popularity: 72.8,
    similarity_score: 0.84,
    bayesian_rating: 8.18,
    final_score: 0.83,
    match_percentage: 92,
    explainability: ["Constructed Reality Theme", "Philosophical Cyberpunk"],
  },
  {
    id: "129",
    title: "Spirited Away",
    tagline: "Tunnel to a mysterious world.",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    genres: ["Animation", "Family", "Fantasy"],
    vote_average: 8.5,
    vote_count: 15000,
    release_date: "2001-07-20",
    release_year: 2001,
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    poster_url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    popularity: 64.1,
    similarity_score: 0.76,
    bayesian_rating: 8.42,
    final_score: 0.79,
    match_percentage: 88,
    explainability: ["Studio Ghibli Masterpiece", "Enchanting World-Building"],
  }
];

const FALLBACK_GENRES: GenreOption[] = [
  { name: "Drama", count: 20265 },
  { name: "Comedy", count: 13182 },
  { name: "Thriller", count: 7624 },
  { name: "Action", count: 6596 },
  { name: "Romance", count: 6719 },
  { name: "Crime", count: 4307 },
  { name: "Science Fiction", count: 3049 },
  { name: "Horror", count: 4673 },
  { name: "Adventure", count: 3496 },
  { name: "Animation", count: 1935 },
  { name: "Mystery", count: 2467 },
  { name: "Fantasy", count: 2313 }
];

async function tryFetch(path: string, options?: RequestInit): Promise<any> {
  let lastError: any = null;
  for (const base of API_ENDPOINTS) {
    try {
      const url = `${base}${path}`;
      const res = await fetch(url, options);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error("Failed to connect to recommendation engine API");
}

export async function checkEngineHealth(): Promise<boolean> {
  try {
    await tryFetch("/health");
    return true;
  } catch {
    return false;
  }
}

export async function searchMovies(query: string, limit = 8): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) return [];
  try {
    return await tryFetch(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  } catch (err) {
    // Fallback search against curated list
    const q = query.toLowerCase().trim();
    return CURATED_FALLBACK_MOVIES
      .filter(m => m.title.toLowerCase().includes(q))
      .map(m => ({
        title: m.title,
        release_year: m.release_year,
        vote_average: m.vote_average,
        poster_url: m.poster_url,
        genres: m.genres
      }))
      .slice(0, limit);
  }
}

export async function getRecommendations(req: RecommendationRequest): Promise<RecommendationResponse> {
  try {
    const res = await tryFetch("/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (res && res.recommendations && res.recommendations.length > 0) {
      return res;
    }
    throw new Error("Empty response from engine");
  } catch (err) {
    console.warn("[CineEngine] Backend offline, presenting curated hybrid recommendations:", err);
    // Filter curated list
    let recs = [...CURATED_FALLBACK_MOVIES];
    // Exclude exact seeds
    const seedSet = new Set(req.seeds.map(s => s.toLowerCase()));
    recs = recs.filter(m => !seedSet.has(m.title.toLowerCase()));

    if (req.min_rating > 0) {
      recs = recs.filter(m => m.vote_average >= req.min_rating);
    }
    if (req.genres && req.genres.length > 0) {
      const gSet = new Set(req.genres.map(g => g.toLowerCase()));
      const filtered = recs.filter(m => m.genres.some(g => gSet.has(g.toLowerCase())));
      if (filtered.length > 0) recs = filtered;
    }

    return {
      seeds: req.seeds,
      total_matches: recs.length,
      recommendations: recs.slice(0, req.limit || 12),
    };
  }
}

export async function getGenres(): Promise<GenreOption[]> {
  try {
    const genres = await tryFetch("/genres");
    if (Array.isArray(genres) && genres.length > 0) return genres;
    return FALLBACK_GENRES;
  } catch {
    return FALLBACK_GENRES;
  }
}

export async function getSurpriseMovie(): Promise<MovieItem | null> {
  try {
    return await tryFetch("/surprise");
  } catch {
    const randomIndex = Math.floor(Math.random() * CURATED_FALLBACK_MOVIES.length);
    return CURATED_FALLBACK_MOVIES[randomIndex];
  }
}

export async function getPopularMovies(limit = 12): Promise<MovieItem[]> {
  try {
    const popular = await tryFetch(`/popular?limit=${limit}`);
    if (Array.isArray(popular) && popular.length > 0) return popular;
    return CURATED_FALLBACK_MOVIES.slice(0, limit);
  } catch {
    return CURATED_FALLBACK_MOVIES.slice(0, limit);
  }
}
