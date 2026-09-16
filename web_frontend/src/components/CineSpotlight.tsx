"use client";

import React from "react";
import { Sparkles, Star, Film, Sliders, ShieldCheck, Tag } from "lucide-react";
import { MovieItem } from "../types/movie";

interface CineSpotlightProps {
  primarySeed: string;
  seedMovie?: MovieItem | null;
  similarityWeight: number;
  totalMatches: number;
  onExploreRecommendations: () => void;
}

export const CineSpotlight: React.FC<CineSpotlightProps> = ({
  primarySeed,
  seedMovie,
  similarityWeight,
  totalMatches,
  onExploreRecommendations,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-8 mb-4">
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200/90 shadow-lg p-6 sm:p-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Movie Poster Preview */}
          <div className="w-32 sm:w-40 aspect-[2/3] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200">
            {seedMovie?.poster_url ? (
              <img
                src={seedMovie.poster_url}
                alt={primarySeed}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-slate-400 bg-gradient-to-b from-slate-100 to-slate-200">
                <Film className="w-8 h-8 mb-1 text-slate-500" />
                <span className="text-[10px] text-center font-bold text-slate-700 line-clamp-2">{primarySeed}</span>
              </div>
            )}
          </div>

          {/* Details & Engine Anchor Info */}
          <div className="flex-1 flex flex-col justify-between text-center md:text-left space-y-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2 border border-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Active Recommendation Anchor</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {primarySeed}
              </h3>

              {seedMovie?.tagline && (
                <p className="text-xs sm:text-sm italic text-slate-500 mt-0.5">
                  "{seedMovie.tagline}"
                </p>
              )}

              {seedMovie?.overview && (
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                  {seedMovie.overview}
                </p>
              )}
            </div>

            {/* Algorithm Synthesis Status */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Model Objective:</span>
                <span className="text-purple-700 font-mono">
                  {Math.round(similarityWeight * 100)}% Sim / {Math.round((1 - similarityWeight) * 100)}% Quality
                </span>
              </div>

              <div className="flex items-center space-x-1.5 font-semibold text-slate-700 bg-emerald-50 px-3 py-1 rounded-xl text-emerald-800 border border-emerald-200/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{totalMatches} Synthesized Recommendations Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
