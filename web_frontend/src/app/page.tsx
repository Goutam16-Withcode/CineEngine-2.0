"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { MoodBar } from "../components/MoodBar";
import { CineSpotlight } from "../components/CineSpotlight";
import { TasteProfileBuilder } from "../components/TasteProfileBuilder";
import { EngineControls } from "../components/EngineControls";
import { MovieGrid } from "../components/MovieGrid";
import { MovieDetailModal } from "../components/MovieDetailModal";
import { WatchlistSheet } from "../components/WatchlistSheet";
import { MovieItem, GenreOption } from "../types/movie";
import {
  getRecommendations,
  getGenres,
  getSurpriseMovie,
  getPopularMovies,
  searchMovies,
} from "../lib/api";

export default function Home() {
  // State
  const [seeds, setSeeds] = useState<string[]>(["Inception"]);
  const [activeSeedMovie, setActiveSeedMovie] = useState<MovieItem | null>(null);
  const [similarityWeight, setSimilarityWeight] = useState<number>(0.65);
  const [minRating, setMinRating] = useState<number>(0.0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<GenreOption[]>([]);
  const [resultLimit, setResultLimit] = useState<number>(18);

  const [recommendations, setRecommendations] = useState<MovieItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSurprising, setIsSurprising] = useState<boolean>(false);

  // Watchlist & Modal
  const [watchlist, setWatchlist] = useState<MovieItem[]>([]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [activeModalMovie, setActiveModalMovie] = useState<MovieItem | null>(null);

  // Initialize
  useEffect(() => {
    // Load local storage watchlist
    try {
      const saved = localStorage.getItem("cineengine_watchlist");
      if (saved) setWatchlist(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load watchlist from localStorage", e);
    }

    // Load genres & trending popular gems
    async function initCatalog() {
      const [genresData, popularData] = await Promise.all([
        getGenres(),
        getPopularMovies(12),
      ]);
      setAvailableGenres(genresData);
      setPopularMovies(popularData);
    }
    initCatalog();

    // Trigger initial recommendation
    fetchRecommendations(["Inception"], 0.65, 0.0, [], 18);
  }, []);

  // Save watchlist updates to local storage
  const updateWatchlist = (newList: MovieItem[]) => {
    setWatchlist(newList);
    try {
      localStorage.setItem("cineengine_watchlist", JSON.stringify(newList));
    } catch (e) {
      console.warn("Could not save watchlist", e);
    }
  };

  const handleToggleWatchlist = (movie: MovieItem) => {
    const exists = watchlist.some((m) => m.title === movie.title);
    if (exists) {
      updateWatchlist(watchlist.filter((m) => m.title !== movie.title));
    } else {
      updateWatchlist([movie, ...watchlist]);
    }
  };

  const handleRemoveFromWatchlist = (title: string) => {
    updateWatchlist(watchlist.filter((m) => m.title !== title));
  };

  const handleClearWatchlist = () => {
    updateWatchlist([]);
  };

  // Engine Fetch
  async function fetchRecommendations(
    currentSeeds = seeds,
    simWeight = similarityWeight,
    rating = minRating,
    genres = selectedGenres,
    limit = resultLimit
  ) {
    if (currentSeeds.length === 0) {
      setRecommendations([]);
      setActiveSeedMovie(null);
      return;
    }
    setLoading(true);

    // Fetch recommendations
    const res = await getRecommendations({
      seeds: currentSeeds,
      similarity_weight: simWeight,
      min_rating: rating,
      min_votes: 20,
      genres: genres,
      limit: limit,
    });
    setRecommendations(res.recommendations);

    // Fetch poster/metadata for primary seed anchor
    if (currentSeeds.length > 0) {
      try {
        const searchMatches = await searchMovies(currentSeeds[0], 1);
        if (searchMatches.length > 0) {
          const match = searchMatches[0];
          setActiveSeedMovie({
            title: match.title,
            overview: "Primary Taste Vector Anchor for this recommendation set.",
            genres: match.genres,
            vote_average: match.vote_average,
            vote_count: 0,
            release_year: match.release_year,
            poster_url: match.poster_url,
            popularity: 0,
            similarity_score: 1.0,
            bayesian_rating: match.vote_average,
            final_score: 1.0,
            match_percentage: 100,
            explainability: ["Primary Seed Anchor"],
          });
        }
      } catch (e) {
        console.warn("Could not fetch seed movie metadata", e);
      }
    }

    setLoading(false);
  }

  // Seed Manipulation
  const handleAddSeed = (title: string) => {
    if (seeds.includes(title) || seeds.length >= 5) return;
    const newSeeds = [...seeds, title];
    setSeeds(newSeeds);
    fetchRecommendations(newSeeds);
  };

  const handleRemoveSeed = (title: string) => {
    const newSeeds = seeds.filter((s) => s !== title);
    setSeeds(newSeeds);
    if (newSeeds.length > 0) {
      fetchRecommendations(newSeeds);
    } else {
      setRecommendations([]);
    }
  };

  const handleClearSeeds = () => {
    setSeeds([]);
    setRecommendations([]);
    setActiveSeedMovie(null);
  };

  const handleSelectMood = (moodSeeds: string[]) => {
    setSeeds(moodSeeds);
    fetchRecommendations(moodSeeds);
  };

  const handleToggleGenre = (genre: string) => {
    let nextGenres: string[];
    if (selectedGenres.includes(genre)) {
      nextGenres = selectedGenres.filter((g) => g !== genre);
    } else {
      nextGenres = [...selectedGenres, genre];
    }
    setSelectedGenres(nextGenres);
    fetchRecommendations(seeds, similarityWeight, minRating, nextGenres);
  };

  const handleSimilarityChange = (val: number) => {
    setSimilarityWeight(val);
    fetchRecommendations(seeds, val, minRating, selectedGenres);
  };

  const handleMinRatingChange = (val: number) => {
    setMinRating(val);
    fetchRecommendations(seeds, similarityWeight, val, selectedGenres);
  };

  const handleResetFilters = () => {
    setSimilarityWeight(0.65);
    setMinRating(0.0);
    setSelectedGenres([]);
    fetchRecommendations(seeds, 0.65, 0.0, []);
  };

  // Surprise Me
  const handleSurprise = async () => {
    setIsSurprising(true);
    const gem = await getSurpriseMovie();
    setIsSurprising(false);
    if (gem) {
      setActiveModalMovie(gem);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navbar */}
      <Navbar
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onSurprise={handleSurprise}
        isSurprising={isSurprising}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {/* Hero & Autocomplete Search */}
        <Hero onSelectMovie={handleAddSeed} selectedSeeds={seeds} />

        {/* Curated Cinematic Moods Bar */}
        <MoodBar onSelectMood={handleSelectMood} activeSeeds={seeds} />

        {/* Active Seed Spotlight Banner */}
        {seeds.length > 0 && (
          <CineSpotlight
            primarySeed={seeds[0]}
            seedMovie={activeSeedMovie}
            similarityWeight={similarityWeight}
            totalMatches={recommendations.length}
            onExploreRecommendations={() => {}}
          />
        )}

        {/* Taste Profile Seed Builder */}
        <TasteProfileBuilder
          seeds={seeds}
          onRemoveSeed={handleRemoveSeed}
          onClearSeeds={handleClearSeeds}
          onAddPreset={handleAddSeed}
          onGenerate={() => fetchRecommendations()}
          loading={loading}
        />

        {/* Engine Tuning & Control Panel */}
        <EngineControls
          similarityWeight={similarityWeight}
          onSimilarityWeightChange={handleSimilarityChange}
          minRating={minRating}
          onMinRatingChange={handleMinRatingChange}
          selectedGenres={selectedGenres}
          onToggleGenre={handleToggleGenre}
          availableGenres={availableGenres}
          resultLimit={resultLimit}
          onResultLimitChange={(limit) => {
            setResultLimit(limit);
            fetchRecommendations(seeds, similarityWeight, minRating, selectedGenres, limit);
          }}
          onReset={handleResetFilters}
        />

        {/* Primary Recommendations Grid & Detailed Analysis View */}
        <MovieGrid
          title={
            seeds.length > 0
              ? `Recommended for: ${seeds.slice(0, 2).join(" + ")}${seeds.length > 2 ? ` (+${seeds.length - 2} more)` : ""}`
              : "Recommendations"
          }
          subtitle="Ranked by Cosine Sparse Vectors blended with Bayesian IMDb Acclaim"
          movies={recommendations}
          loading={loading}
          onSelectMovie={(movie) => setActiveModalMovie(movie)}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
        />

        {/* Trending / Classic High Bayesian Rated Gems */}
        {popularMovies.length > 0 && seeds.length > 0 && (
          <MovieGrid
            title="Curated Masterpieces & Classics"
            subtitle="Top Bayesian weighted ratings across 45,000+ movies in the catalog"
            movies={popularMovies}
            loading={false}
            onSelectMovie={(movie) => setActiveModalMovie(movie)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}
      </main>

      {/* Movie Details Modal */}
      <MovieDetailModal
        movie={activeModalMovie}
        onClose={() => setActiveModalMovie(null)}
        isWatchlisted={
          activeModalMovie
            ? watchlist.some((m) => m.title === activeModalMovie.title)
            : false
        }
        onToggleWatchlist={handleToggleWatchlist}
        onAddSeed={handleAddSeed}
        isSeed={
          activeModalMovie ? seeds.includes(activeModalMovie.title) : false
        }
      />

      {/* Watchlist Drawer */}
      <WatchlistSheet
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveMovie={handleRemoveFromWatchlist}
        onClearWatchlist={handleClearWatchlist}
        onSelectMovie={(movie) => setActiveModalMovie(movie)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-8 bg-white/80 backdrop-blur-md text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>CineEngine 2.0 • Light Edition • Machine Learning & NLP Recommendation System</p>
          <p className="text-slate-400">Dataset: TMDb 45k Catalog • Sparse Vectors • Bayesian WR</p>
        </div>
      </footer>
    </div>
  );
}
