"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Plus, Film, Star } from "lucide-react";
import { SearchResult } from "../types/movie";
import { searchMovies } from "../lib/api";

interface SearchBarProps {
  onSelectMovie: (title: string) => void;
  selectedSeeds: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectMovie, selectedSeeds }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchMovies(query, 7);
      setResults(res);
      setLoading(false);
      setIsOpen(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePick = (title: string) => {
    onSelectMovie(title);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search 45,000+ movies (e.g. Inception, Toy Story, Pulp Fiction)..."
          className="w-full pl-12 pr-14 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-500 shadow-lg shadow-slate-200/50 transition-all"
        />
        <div className="absolute right-4 hidden sm:flex items-center space-x-1">
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 rounded border border-slate-200">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 py-2 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Matching Titles ({results.length})
          </div>
          {results.map((item, idx) => {
            const isAlreadySelected = selectedSeeds.includes(item.title);
            return (
              <div
                key={idx}
                onClick={() => !isAlreadySelected && handlePick(item.title)}
                className={`flex items-center justify-between px-3 py-2.5 mx-1.5 rounded-xl cursor-pointer transition-colors ${
                  isAlreadySelected
                    ? "opacity-40 cursor-not-allowed bg-slate-50"
                    : "hover:bg-purple-50 hover:text-purple-900"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {item.poster_url ? (
                    <img
                      src={item.poster_url}
                      alt={item.title}
                      className="w-9 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-100 border border-slate-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-9 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                      <Film className="w-4 h-4" />
                    </div>
                  )}
                  <div className="truncate">
                    <div className="font-semibold text-sm text-slate-900 truncate">
                      {item.title}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      {item.release_year && <span>{item.release_year}</span>}
                      {item.vote_average > 0 && (
                        <span className="flex items-center space-x-1 text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </span>
                      )}
                      {item.genres.length > 0 && (
                        <span className="text-slate-400 truncate">
                          • {item.genres.slice(0, 2).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-3">
                  {isAlreadySelected ? (
                    <span className="text-xs text-slate-400 font-medium">Added</span>
                  ) : (
                    <button
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-purple-600 hover:text-white transition"
                      title="Add to taste profile"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
