"use client";

import React from "react";
import { Sparkles, X, Layers, Flame } from "lucide-react";

interface TasteProfileBuilderProps {
  seeds: string[];
  onRemoveSeed: (title: string) => void;
  onClearSeeds: () => void;
  onAddPreset: (title: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

const POPULAR_PRESETS = [
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "Pulp Fiction",
  "Toy Story",
  "The Matrix",
  "Spirited Away",
  "Fight Club",
];

export const TasteProfileBuilder: React.FC<TasteProfileBuilderProps> = ({
  seeds,
  onRemoveSeed,
  onClearSeeds,
  onAddPreset,
  onGenerate,
  loading,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-5 rounded-2xl glass-panel border border-slate-200/80 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Active Taste Profile ({seeds.length} / 5 Seeds)
          </h3>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            — Blends multiple plots and genres
          </span>
        </div>

        {seeds.length > 0 && (
          <button
            onClick={onClearSeeds}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 self-start sm:self-auto transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Seed Chips */}
      {seeds.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {seeds.map((seed, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold shadow-sm transition hover:bg-purple-100"
            >
              <span>{seed}</span>
              <button
                onClick={() => onRemoveSeed(seed)}
                className="text-purple-400 hover:text-purple-700 p-0.5 rounded-full hover:bg-purple-200"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Synthesizing..." : "Recalculate"}</span>
          </button>
        </div>
      ) : (
        <div className="text-xs text-slate-500 italic py-2">
          Search and select at least 1 movie above, or click any popular seed below:
        </div>
      )}

      {/* Quick Suggestions / Presets */}
      <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
        <span className="flex items-center text-[11px] font-semibold text-slate-500 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-500 mr-1" /> Quick Seeds:
        </span>
        <div className="flex items-center space-x-1.5 flex-nowrap">
          {POPULAR_PRESETS.map((p, idx) => {
            const isSelected = seeds.includes(p);
            return (
              <button
                key={idx}
                onClick={() => !isSelected && onAddPreset(p)}
                disabled={isSelected || seeds.length >= 5}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-slate-100 text-slate-400 opacity-60 cursor-default"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-purple-300 hover:text-purple-700 shadow-sm"
                }`}
              >
                + {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
