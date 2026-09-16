"use client";

import React from "react";
import { Compass } from "lucide-react";

interface MoodOption {
  label: string;
  emoji: string;
  seeds: string[];
  genre?: string;
}

const MOODS: MoodOption[] = [
  { label: "Mind-Bending Sci-Fi", emoji: "🌌", seeds: ["Inception", "The Matrix"] },
  { label: "High-Octane Thrillers", emoji: "⚡", seeds: ["The Dark Knight", "Shutter Island"] },
  { label: "Animated Masterpieces", emoji: "🎨", seeds: ["Toy Story", "Spirited Away"] },
  { label: "Cult Crime & Noir", emoji: "🕶️", seeds: ["Pulp Fiction", "Fight Club"] },
  { label: "Cosmic Odyssey", emoji: "🪐", seeds: ["Interstellar", "2001: A Space Odyssey"] },
  { label: "Deep Mystery & Twists", emoji: "🔍", seeds: ["The Prestige", "Memento"] },
];

interface MoodBarProps {
  onSelectMood: (seeds: string[]) => void;
  activeSeeds: string[];
}

export const MoodBar: React.FC<MoodBarProps> = ({ onSelectMood, activeSeeds }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-4">
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-2">
        <Compass className="w-4 h-4 text-purple-600" />
        <span className="uppercase tracking-wider">Curated Cinematic Moods:</span>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {MOODS.map((mood, idx) => {
          const isActive = mood.seeds.every((s) => activeSeeds.includes(s));
          return (
            <button
              key={idx}
              onClick={() => onSelectMood(mood.seeds)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                isActive
                  ? "bg-purple-600 text-white shadow-purple-600/20 scale-[1.02]"
                  : "bg-white text-slate-700 border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-700"
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
