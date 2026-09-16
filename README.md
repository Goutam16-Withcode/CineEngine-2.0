# CineEngine 2.0 — Advanced Movie Recommendation System

An industrial-grade, 4-stage movie recommendation engine with a Python FastAPI backend and a Next.js + shadcn/ui streaming web application.

---

## 🌐 Live Deployments

| Component | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App (Main)** | **Vercel** | 🔗 **[https://cine-engine-2-0.vercel.app/](https://cine-engine-2-0.vercel.app/)** | ![Vercel](https://img.shields.io/badge/Vercel-Production-success?style=flat-square&logo=vercel) |
| **Latest Deployment** | **Vercel** | 🔗 **[https://cine-engine-2-0-l6a32ydeg-goutam16-withcodes-projects.vercel.app/](https://cine-engine-2-0-l6a32ydeg-goutam16-withcodes-projects.vercel.app/)** | ![Vercel](https://img.shields.io/badge/Vercel-Latest_Build-blue?style=flat-square&logo=vercel) |
| **Backend Recommendation API** | **Render** | 🔗 **[https://cineengine-2-0.onrender.com/](https://cineengine-2-0.onrender.com/)** | ![Render](https://img.shields.io/badge/Render-Live-success?style=flat-square&logo=render) |
| **Interactive API Docs** | **Swagger / OpenAPI** | 🔗 **[https://cineengine-2-0.onrender.com/docs](https://cineengine-2-0.onrender.com/docs)** | ![API Docs](https://img.shields.io/badge/OpenAPI-Interactive_Docs-blue?style=flat-square&logo=fastapi) |

---

## Architecture Overview

```text
e:/Movie recommendation/
├── Movie recommendation/       <-- [Original files kept 100% untouched]
│   ├── app.py
│   ├── notebook.ipynb
│   └── ...
│
├── engine_backend/             <-- [Python FastAPI Recommendation Engine]
│   ├── core/
│   │   ├── pipeline.py         <-- 4-Stage Candidate Retrieval & Bayesian Reranker
│   │   ├── enricher.py         <-- TMDB Poster CDN & Metadata Merger
│   │   └── models.py           <-- Pydantic Schemas
│   ├── data/
│   │   └── enriched_movies.pkl <-- 45,447 enriched movies cached
│   ├── api.py                  <-- REST Endpoints
│   ├── test_engine.py          <-- Verification script
│   └── run.py                  <-- Launcher
│
└── web_frontend/               <-- [Next.js 14 + shadcn/ui Frontend]
    ├── src/
    │   ├── app/                <-- App Router (layout.tsx, page.tsx, globals.css)
    │   ├── components/         <-- Hero, SearchBar, TasteBuilder, Sliders, Cards, Modal
    │   ├── lib/api.ts          <-- Engine Client (configured for production & local)
    │   └── types/movie.ts      <-- TypeScript Definitions
    ├── tailwind.config.ts
    └── package.json
```

---

## 4-Stage Recommendation Engine Pipeline

1. **Stage 1: Candidate Generation (Vector Retrieval)**
   - Sparse vector retrieval using TF-IDF and `linear_kernel`.
   - Multi-seed taste vector synthesis: blends multiple movies into an aggregated user preference vector.
2. **Stage 2: Scoring & Bayesian Reranker (IMDb Formula)**
   - Computes weighted score:
     $$WR = \left(\frac{v}{v+m}\right) R + \left(\frac{m}{v+m}\right) C$$
   - Blends content similarity with Bayesian rating using a tunable $\alpha$ parameter (User controls "More Similar" vs "Higher Quality").
3. **Stage 3: Filtering & Diversity**
   - Filters by minimum rating, minimum votes, genre tags, and release decade.
   - Prevents sequel clustering.
4. **Stage 4: Explainability & Asset Enrichment**
   - Produces match percentage (`98% Match`).
   - Generates dynamic reason tags (*"Shared Genre: Animation"*, *"High Plot & Theme Match"*, *"Acclaimed Critical Score"*).
   - Resolves high-resolution movie artwork via TheMovieDB free CDN (`https://image.tmdb.org/t/p/w500/...`).

---

## Key Features in the UI
- **Live Autocomplete Search (`Ctrl+K`)**: Instant search across 45,000+ films with live poster thumbnails and ratings.
- **Multi-Movie Taste Profile**: Add up to 5 favorite movies to blend recommendations.
- **Engine Tuning Panel**: Sliders to adjust Similarity vs. Quality, rating thresholds, and genre filter pills.
- **5-Column Responsive Card Grid**: Hover effects, match percentage badges, and star ratings.
- **Movie Detail Modal**: Full plot synopsis, tagline, explainability breakdown, and action triggers.
- **Local Watchlist**: Save and manage favorite recommendations.

---

## How to Run Locally

### Step 1: Start the Backend Recommendation Engine
Open a terminal in `engine_backend/`:
```bash
cd "engine_backend"
python run.py
```
> The API will be live at: `http://127.0.0.1:8000`  
> Interactive OpenAPI documentation: `http://127.0.0.1:8000/docs`

### Step 2: Start the Next.js Frontend
Open a second terminal in `web_frontend/`:
```bash
cd "web_frontend"
npm run dev
```
> Open your browser at: `http://localhost:3000`

---

## Cloud Deployment Configuration

- **Backend (Render)**:
  - **Root Directory**: `engine_backend`
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
- **Frontend (Vercel)**:
  - **Root Directory**: `web_frontend`
  - **Environment Variable**: `NEXT_PUBLIC_ENGINE_API_URL=https://cineengine-2-0.onrender.com/api`
