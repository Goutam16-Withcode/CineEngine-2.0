"use client";

import React, { useState } from "react";
import { Film, Loader2, LayoutGrid, ListFilter, Star, Sparkles, Bookmark, Info } from "lucide-react";
import { MovieItem } from "../types/movie";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  title: string;
  subtitle?: string;
  movies: MovieItem[];
  loading: boolean;
  onSelectMovie: (movie: MovieItem) => void;
  watchlist: MovieItem[];
  onToggleWatchlist: (movie: MovieItem) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  title,
  subtitle,
  movies,
  loading,
  onSelectMovie,
  watchlist,
  onToggleWatchlist,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "detailed">("grid");
  const watchlistIds = new Set(watchlist.map((m) => m.title));

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-slate-200/80 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center space-x-2">
            <span>{title}</span>
            {movies.length > 0 && !loading && (
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-full">
                {movies.length} matches
              </span>
            )}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">{subtitle}</p>}
        </div>

        {/* View Switcher */}
        {movies.length > 0 && !loading && (
          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                viewMode === "grid"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Poster Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                viewMode === "detailed"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Detailed Analysis View"
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden md:inline">Detailed Analysis</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-sm text-slate-600 font-semibold">
            Synthesizing 45,000+ movie vectors & calculating Bayesian scores...
          </p>
        </div>
      ) : movies.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie, idx) => (
              <MovieCard
                key={`${movie.title}-${idx}`}
                movie={movie}
                onSelect={onSelectMovie}
                isWatchlisted={watchlistIds.has(movie.title)}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        ) : (
          /* Detailed Row View with Analysis Breakdown */
          <div className="space-y-3">
            {movies.map((movie, idx) => {
              const isWatchlisted = watchlistIds.has(movie.title);
              return (
                <div
                  key={`${movie.title}-${idx}`}
                  onClick={() => onSelectMovie(movie)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer gap-4"
                >
                  <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                    {/* Poster */}
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {movie.poster_url ? (
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Film className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Meta & Plot */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-slate-900 truncate hover:text-purple-600">
                          {movie.title}
                        </h4>
                        {movie.release_year && (
                          <span className="text-xs text-slate-400 font-medium">
                            ({movie.release_year})
                          </span>
                        )}
                        {movie.vote_average > 0 && (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      {movie.overview && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {movie.overview}
                        </p>
                      )}

                      {/* Explainability Tags */}
                      {movie.explainability && movie.explainability.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {movie.explainability.map((exp, eIdx) => (
                            <span
                              key={eIdx}
                              className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100"
                            >
                              💡 {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Score & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{movie.match_percentage}% Affinity</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(movie);
                        }}
                        className={`p-2 rounded-xl transition ${
                          isWatchlisted
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title={isWatchlisted ? "Remove from watchlist" : "Save to watchlist"}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => onSelectMovie(movie)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <Film className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.2]" />
          <h3 className="text-base font-bold text-slate-800">No movies found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Try adjusting your algorithm filters or picking a different seed movie in the search bar above.
          </p>
        </div>
      )}
    </section>
  );
};
