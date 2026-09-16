"use client";

import React from "react";
import { X, Star, Bookmark, Sparkles, Film, Check, Plus } from "lucide-react";
import { MovieItem } from "../types/movie";

interface MovieDetailModalProps {
  movie: MovieItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: MovieItem) => void;
  onAddSeed: (title: string) => void;
  isSeed: boolean;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onAddSeed,
  isSeed,
}) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header Row with Poster & Key Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster Thumbnail */}
            <div className="w-40 sm:w-48 aspect-[2/3] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200 self-center sm:self-start">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <Film className="w-12 h-12 mb-2" />
                  <span className="text-xs">No Poster</span>
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="flex flex-col justify-between flex-grow space-y-3">
              <div>
                {movie.match_percentage > 0 && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{movie.match_percentage}% Recommendation Match</span>
                  </span>
                )}

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {movie.title}
                </h2>

                {movie.tagline && (
                  <p className="text-sm italic text-slate-500 mt-1">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3 font-medium">
                  {movie.release_year && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      Year: {movie.release_year}
                    </span>
                  )}
                  {movie.vote_average > 0 && (
                    <span className="flex items-center space-x-1 text-amber-800 font-bold px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{movie.vote_average.toFixed(1)} / 10</span>
                      <span className="text-slate-500 font-normal">({movie.vote_count} votes)</span>
                    </span>
                  )}
                  {movie.bayesian_rating > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-mono">
                      Bayesian WR: {movie.bayesian_rating.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Genre Chips */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {movie.genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={() => onToggleWatchlist(movie)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    isWatchlisted
                      ? "bg-purple-600 text-white shadow-purple-600/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>{isWatchlisted ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  onClick={() => onAddSeed(movie.title)}
                  disabled={isSeed}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    isSeed
                      ? "bg-slate-100 text-slate-400 cursor-default"
                      : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                  }`}
                >
                  {isSeed ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isSeed ? "Active Seed" : "Use as Taste Seed"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Plot Overview */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Plot Synopsis
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              {movie.overview || "No overview available for this title in the catalog."}
            </p>
          </div>

          {/* Recommendation Explainability Breakdown */}
          {movie.explainability && movie.explainability.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Why CineEngine Recommended This Title:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-purple-950 font-medium">
                {movie.explainability.map((exp, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
