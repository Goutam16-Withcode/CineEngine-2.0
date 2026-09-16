import streamlit as st
import pickle
import numpy as np
from sklearn.metrics.pairwise import linear_kernel
import pandas as pd

# ------------------------------------------------
# LOAD PICKLE FILES
# ------------------------------------------------
df = pickle.load(open("movies_df.pkl", "rb"))
tfidf_matrix = pickle.load(open("tfidf_matrix.pkl", "rb"))
indices = pickle.load(open("indices.pkl", "rb"))  # can return series/arrays
tfidf = pickle.load(open("tfidf_vectorizer.pkl", "rb"))

# ------------------------------------------------
# FIX B: Safe way to convert any index to a single int
# ------------------------------------------------
def _get_single_index(idx):
    # idx might be: int, numpy.int64, list, array, pandas Series
    if isinstance(idx, (list, tuple, np.ndarray, pd.Series)):
        return int(idx[0])  # pick the first match
    return int(idx)

# ------------------------------------------------
# RECOMMEND FUNCTION (RAM SAFE + ERROR SAFE)
# ------------------------------------------------
def recommend(title, n=10):
    if title not in indices:
        return ["Movie not found in dataset"]

    raw_idx = indices[title]
    idx = _get_single_index(raw_idx)  # FIX B — ensure scalar int

    # compute similarity ONLY for this movie (doesn't crash RAM)
    sim_scores = linear_kernel(tfidf_matrix[idx], tfidf_matrix).flatten()

    # sort by similarity
    sorted_idx = np.argsort(sim_scores)[::-1]

    # remove itself (must compare with scalar)
    sorted_idx = sorted_idx[sorted_idx != idx]

    # pick top n
    sorted_idx = sorted_idx[:n]

    # safety: only indices within df size
    sorted_idx = [i for i in sorted_idx if 0 <= i < len(df)]

    # return titles
    return df['title'].iloc[sorted_idx].tolist()


# ------------------------------------------------
# STREAMLIT UI
# ------------------------------------------------
st.title("🎬 Movie Recommendation System (NLP + TF-IDF)")
st.write("Select a movie and get top recommendations instantly!")

# movie dropdown
movie_list = df['title'].values
selected_movie = st.selectbox("Choose a movie:", movie_list)

if st.button("Recommend"):
    results = recommend(selected_movie)
    st.subheader("📌 Recommendations:")
    for m in results:
        st.write("👉", m)
