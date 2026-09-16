"use client";

import React from "react";
import { X, Bookmark, Trash2, Film, Star } from "lucide-react";
import { MovieItem } from "../types/movie";

interface WatchlistSheetProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: MovieItem[];
  onRemoveMovie: (title: string) => void;
  onClearWatchlist: () => void;
  onSelectMovie: (movie: MovieItem) => void;
}

export const WatchlistSheet: React.FC<WatchlistSheetProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveMovie,
  onClearWatchlist,
  onSelectMovie,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-purple-600 fill-purple-600" />
              <h3 className="font-bold text-lg text-slate-900">
                Saved Watchlist ({watchlist.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Watchlisted Movies */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {watchlist.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <Bookmark className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.2]" />
                <p className="text-sm font-semibold text-slate-600">Your watchlist is empty</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click the bookmark icon on any movie card to save it here.
                </p>
              </div>
            ) : (
              watchlist.map((movie, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-purple-200 transition"
                >
                  <div
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                    className="flex items-center space-x-3 cursor-pointer overflow-hidden flex-1"
                  >
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-11 h-15 rounded-lg object-cover flex-shrink-0 bg-slate-100 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-11 h-15 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                        <Film className="w-4 h-4" />
                      </div>
                    )}
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-slate-900 truncate hover:text-purple-600">
                        {movie.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5 font-medium">
                        {movie.release_year && <span>{movie.release_year}</span>}
                        {movie.vote_average > 0 && (
                          <span className="flex items-center space-x-1 text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveMovie(movie.title)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {watchlist.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <button
                onClick={onClearWatchlist}
                className="text-xs font-semibold text-slate-400 hover:text-red-500 transition"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
