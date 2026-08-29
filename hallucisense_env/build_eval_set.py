# build_eval_set.py (incremental save version)
import pandas as pd
import os
from load_truthfulqa import load_truthfulqa
from generator import get_response
from claim_extractor import extract_claims
from retrieval_verifier import factual_error_score
from confidence_analyzer import confidence_gap_score
from consistency_checker import consistency_fail_score
from fusion import h_score, classify

def build_dataset(n_samples=50, model="gemma2:2b", output="data/eval_results.csv"):
    df = load_truthfulqa(n_samples=n_samples)

    # resume support: skip questions already processed
    done_questions = set()
    if os.path.exists(output):
        existing = pd.read_csv(output)
        done_questions = set(existing["question"])
        print(f"Found {len(done_questions)} already-processed questions, will skip them.")

    for i, row in df.iterrows():
        query = row["Question"]
        if query in done_questions:
            continue

        print(f"[{i+1}/{len(df)}] {query}")
        try:
            response = get_response(query, model=model)
            claims = extract_claims(response)
            fe_scores = [factual_error_score(c) for c in claims] if claims else [0.5]
            fe_avg = max(fe_scores)
            cg = confidence_gap_score(query, response, model=model)
            cf = consistency_fail_score(query, response, model=model, n=2)
            h = h_score(fe_avg, cg, cf)
            verdict = classify(h)

            row_data = {
                "question": query,
                "category": row["Category"],
                "response": response,
                "best_answer_reference": row["Best Answer"],
                "FE": fe_avg,
                "CG": cg,
                "CF": cf,
                "H_score": h,
                "predicted_verdict": verdict,
                "human_label": ""
            }

            # append immediately to CSV (crash-safe)
            row_df = pd.DataFrame([row_data])
            row_df.to_csv(output, mode="a", header=not os.path.exists(output), index=False)

        except Exception as e:
            print(f"  Error on '{query}': {e}")
            continue

    print(f"\nDone. Results saved incrementally to {output}")

if __name__ == "__main__":
    build_dataset(n_samples=50)