# confidence_analyzer.py
import streamlit as st
from sentence_transformers import SentenceTransformer, util
from generator import get_response


@st.cache_resource
def load_embedder():
    return SentenceTransformer("all-MiniLM-L6-v2")


embedder = load_embedder()


def confidence_gap_score(query, response, model="gemma2:2b", n=2):
    """
    Semantic entropy-based confidence: re-generate the response n more times
    with sampling temperature, then measure how much the responses diverge
    in meaning. High divergence -> low confidence -> high CG.
    """
    samples = [response]
    for _ in range(n):
        samples.append(get_response(query, model=model, temperature=0.8))

    embeddings = embedder.encode(samples, convert_to_tensor=True)
    sim_matrix = util.cos_sim(embeddings, embeddings).cpu().numpy()
    n_samples = len(samples)
    avg_sim = (sim_matrix.sum() - n_samples) / (n_samples * (n_samples - 1))
    cg = 1 - avg_sim
    return max(0.0, min(cg, 1.0))