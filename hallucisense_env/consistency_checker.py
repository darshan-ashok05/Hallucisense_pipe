# consistency_checker.py
import streamlit as st
from sentence_transformers import SentenceTransformer, util
from generator import get_response, paraphrase_query


@st.cache_resource
def load_embedder():
    return SentenceTransformer("all-mpnet-base-v2")


embedder = load_embedder()


def consistency_fail_score(query, original_response, model="gemma2:2b", n=2):
    paraphrases = paraphrase_query(query, model, n)
    responses = [get_response(p, model) for p in paraphrases]
    all_texts = [original_response] + responses
    embeddings = embedder.encode(all_texts, convert_to_tensor=True)
    sims = util.cos_sim(embeddings[0], embeddings[1:])
    avg_sim = sims.mean().item()
    return 1 - avg_sim