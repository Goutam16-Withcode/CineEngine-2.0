"use client";

import React from "react";
import { Sparkles, Film, Bookmark } from "lucide-react";

interface NavbarProps {
  watchlistCount: number;
  onOpenWatchlist: () => void;
  onSurprise: () => void;
  isSurprising: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  watchlistCount,
  onOpenWatchlist,
  onSurprise,
  isSurprising,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                CINE<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">ENGINE</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                v2.0 LIGHT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Sparse Vector & Bayesian Acclaim Reranker
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Surprise Me button */}
          <button
            onClick={onSurprise}
            disabled={isSurprising}
            className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/90 text-slate-700 border border-slate-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50 transition-all shadow-sm"
            title="Get a surprise high-scoring recommendation"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-600 ${isSurprising ? 'animate-spin' : ''}`} />
            <span>{isSurprising ? "Searching..." : "Surprise Gem"}</span>
          </button>

          {/* Engine Status indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px]">Engine Active</span>
          </div>

          {/* Watchlist button */}
          <button
            onClick={onOpenWatchlist}
            className="relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm shadow-purple-600/20"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-purple-700 font-bold text-[10px]">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
