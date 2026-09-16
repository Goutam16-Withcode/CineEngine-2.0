"use client";

import React from "react";
import { SlidersHorizontal, Star, ShieldCheck, Tag, RotateCcw } from "lucide-react";
import { GenreOption } from "../types/movie";

interface EngineControlsProps {
  similarityWeight: number;
  onSimilarityWeightChange: (val: number) => void;
  minRating: number;
  onMinRatingChange: (val: number) => void;
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;
  availableGenres: GenreOption[];
  resultLimit: number;
  onResultLimitChange: (limit: number) => void;
  onReset: () => void;
}

export const EngineControls: React.FC<EngineControlsProps> = ({
  similarityWeight,
  onSimilarityWeightChange,
  minRating,
  onMinRatingChange,
  selectedGenres,
  onToggleGenre,
  availableGenres,
  resultLimit,
  onResultLimitChange,
  onReset,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-5 rounded-2xl glass-card border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Engine Tuning & Filtering
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slider 1: Similarity vs Quality Weight */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Algorithm Objective</span>
            </label>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              {Math.round(similarityWeight * 100)}% Sim / {Math.round((1 - similarityWeight) * 100)}% Quality
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.95"
            step="0.05"
            value={similarityWeight}
            onChange={(e) => onSimilarityWeightChange(parseFloat(e.target.value))}
            className="w-full accent-purple-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-500 mt-1">
            <span>Critical Acclaim (IMDb WR)</span>
            <span>Plot & Thematic Match</span>
          </div>
        </div>

        {/* Slider 2: Min Rating Threshold */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Minimum IMDb Rating</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              {minRating > 0 ? `${minRating.toFixed(1)} ★` : "Any"}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="8.5"
            step="0.5"
            value={minRating}
            onChange={(e) => onMinRatingChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-medium text-slate-500 mt-1">
            <span>Any Rating (0.0)</span>
            <span>Masterpieces (8.0+)</span>
          </div>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 mb-2">
          <Tag className="w-3.5 h-3.5 text-purple-600" />
          <span>Genre Filter ({selectedGenres.length > 0 ? selectedGenres.length : "All"} active):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {availableGenres.slice(0, 14).map((g) => {
            const isSelected = selectedGenres.includes(g.name);
            return (
              <button
                key={g.name}
                onClick={() => onToggleGenre(g.name)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-200/70"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
