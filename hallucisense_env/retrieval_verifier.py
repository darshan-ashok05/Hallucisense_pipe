# retrieval_verifier.py
import requests
import time
import torch
import spacy
import streamlit as st
from transformers import AutoTokenizer, AutoModelForSequenceClassification

nlp = spacy.load("en_core_web_sm")

HEADERS = {
    "User-Agent": "HalluciSense-StudentProject/1.0 (JSS Academy of Technical Education; student research project)"
}

nli_model_name = "MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli"


@st.cache_resource
def load_nli_model():
    tokenizer = AutoTokenizer.from_pretrained(nli_model_name)
    model = AutoModelForSequenceClassification.from_pretrained(nli_model_name)
    model.eval()
    return tokenizer, model


nli_tokenizer, nli_model = load_nli_model()

_evidence_cache = {}


def extract_search_query(claim):
    doc = nlp(claim)
    priority_labels = {"PERSON", "GPE", "LOC", "ORG", "EVENT", "FAC", "NORP"}
    good_entities = [ent.text for ent in doc.ents if ent.label_ in priority_labels]
    if good_entities:
        return good_entities[0]
    if doc.ents:
        return doc.ents[0].text
    noun_chunks = [chunk.text for chunk in doc.noun_chunks if not chunk.text.replace(" ", "").isdigit()]
    if noun_chunks:
        return noun_chunks[0]
    return claim


def _get_with_retry(url, params, max_retries=4, base_delay=5):
    for attempt in range(max_retries):
        resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if resp.status_code == 429:
            wait = base_delay * (attempt + 1)
            print(f"[DEBUG] Rate limited, waiting {wait}s...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        return resp
    return None


def get_evidence(claim, k=2):
    search_query = extract_search_query(claim)
    if search_query in _evidence_cache:
        return _evidence_cache[search_query]

    time.sleep(1)
    try:
        search_url = "https://en.wikipedia.org/w/api.php"
        params = {"action": "query", "list": "search", "srsearch": search_query, "format": "json", "srlimit": k}
        resp = _get_with_retry(search_url, params)
        if resp is None:
            _evidence_cache[search_query] = []
            return []
        data = resp.json()
        titles = [item["title"] for item in data.get("query", {}).get("search", [])]
        if not titles:
            _evidence_cache[search_query] = []
            return []

        passages = []
        for title in titles:
            time.sleep(0.5)
            extract_params = {
                "action": "query", "prop": "extracts",
                "explaintext": True, "titles": title, "format": "json"
            }
            r2 = _get_with_retry(search_url, extract_params)
            if r2 is None:
                continue
            pages = r2.json().get("query", {}).get("pages", {})
            for page in pages.values():
                extract = page.get("extract", "")
                if extract:
                    paras = [p.strip() for p in extract.split("\n") if len(p.strip()) > 50]
                    passages.extend(paras[:2])

        _evidence_cache[search_query] = passages
        return passages

    except Exception as e:
        print(f"[DEBUG] Retrieval failed for '{claim}': {type(e).__name__}: {e}")
        _evidence_cache[search_query] = []
        return []


def classify_entailment(claim, evidence):
    inputs = nli_tokenizer(evidence, claim, return_tensors="pt", truncation=True, padding=True, max_length=256)
    with torch.no_grad():
        logits = nli_model(**inputs).logits
        probs = torch.softmax(logits, dim=1)[0]
    label_id = probs.argmax().item()
    label = nli_model.config.id2label[label_id].lower()
    confidence = probs[label_id].item()
    return label, confidence


def factual_error_score(claim, debug=False):
    evidence_list = get_evidence(claim)
    if not evidence_list:
        return 0.5

    results = []
    for ev in evidence_list:
        label, confidence = classify_entailment(claim, ev)
        if debug:
            print(f"[DEBUG] Claim: {claim[:60]}")
            print(f"        Evidence: {ev[:150]}...")
            print(f"        Label: {label}, Confidence: {confidence:.3f}\n")
        results.append((label, confidence))

    strong_entailments = [c for l, c in results if "entail" in l and c >= 0.85]
    strong_contradictions = [c for l, c in results if "contradict" in l and c >= 0.85]

    if strong_contradictions and not strong_entailments:
        return 1.0
    if strong_entailments and not strong_contradictions:
        return 0.0
    if strong_entailments and strong_contradictions:
        return 1.0 if max(strong_contradictions) > max(strong_entailments) else 0.0

    return 0.5