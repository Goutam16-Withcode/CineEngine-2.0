"use client";

import React from "react";
import { Star, Film, Bookmark, Info, Sparkles } from "lucide-react";
import { MovieItem } from "../types/movie";

interface MovieCardProps {
  movie: MovieItem;
  onSelect: (movie: MovieItem) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: MovieItem) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-1.5">
      {/* Poster Image Container */}
      <div
        className="relative w-full aspect-[2/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(movie)}
      >
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-400 bg-slate-50">
            <Film className="w-12 h-12 mb-2 stroke-[1.2]" />
            <span className="text-xs text-center font-medium line-clamp-2 text-slate-600">{movie.title}</span>
          </div>
        )}

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="w-full py-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-md"
          >
            <Info className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>

        {/* Match Percentage Badge */}
        {movie.match_percentage > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-extrabold shadow-md backdrop-blur-md flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>{movie.match_percentage}% Match</span>
          </div>
        )}

        {/* Watchlist Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow-md ${
            isWatchlisted
              ? "bg-purple-600 text-white"
              : "bg-white/85 text-slate-700 hover:bg-purple-600 hover:text-white"
          }`}
          title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Release Year & Rating Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>{movie.release_year || "Unknown"}</span>
            {movie.vote_average > 0 && (
              <span className="flex items-center space-x-1 text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-slate-400 text-[10px] font-normal">({movie.vote_count})</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            onClick={() => onSelect(movie)}
            className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1 cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h4>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
              {movie.genres.slice(0, 3).join(" • ")}
            </div>
          )}
        </div>

        {/* Explainability Tag */}
        {movie.explainability && movie.explainability.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100">
            <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-semibold truncate max-w-full">
              💡 {movie.explainability[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
