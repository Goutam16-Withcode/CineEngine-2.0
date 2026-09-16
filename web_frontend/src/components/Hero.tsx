"use client";

import React from "react";
import { Sparkles, Cpu, Zap, Database } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  onSelectMovie: (title: string) => void;
  selectedSeeds: string[];
}

export const Hero: React.FC<HeroProps> = ({ onSelectMovie, selectedSeeds }) => {
  return (
    <section className="relative pt-12 pb-6 sm:pt-16 sm:pb-8 overflow-hidden">
      {/* Background ambient lighting glows (light mode aurora) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-200/40 via-sky-200/30 to-pink-200/30 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-200/30 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-amber-100/40 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/80 text-purple-800 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Industrial 4-Stage Discovery Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
          Find Your Next Great Story <br />
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            With Machine Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 mb-8 font-normal">
          Powered by Sparse Vector Retrieval, Bayesian Quality Reranking (IMDb $WR$), and dynamic multi-seed taste profile synthesis across 45,000+ films.
        </p>

        {/* Search Bar */}
        <SearchBar onSelectMovie={onSelectMovie} selectedSeeds={selectedSeeds} />

        {/* Metrics Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-slate-200/70 text-slate-500 text-xs font-medium">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span>45,447 Films Catalog</span>
          </div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Bayesian IMDb WR Reranker</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Sub-50ms Inference</span>
          </div>
        </div>
      </div>
    </section>
  );
};
