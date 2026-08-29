# tune_threshold.py
import pandas as pd
import numpy as np
from fusion import h_score

df = pd.read_csv("data/eval_results.csv").dropna(subset=["human_label"])
df["human_label"] = df["human_label"].str.strip().str.capitalize()
df["is_hallucinated"] = (df["human_label"] == "Hallucinated").astype(int)

# recompute H-Score with your final tuned weights
df["H_recomputed"] = df.apply(lambda r: h_score(r["FE"], r["CG"], r["CF"]), axis=1)

best_f1, best_thresh = -1, None
results = []

for thresh in np.arange(0.3, 0.8, 0.01):
    preds = (df["H_recomputed"] >= thresh).astype(int)
    tp = ((preds == 1) & (df["is_hallucinated"] == 1)).sum()
    fp = ((preds == 1) & (df["is_hallucinated"] == 0)).sum()
    fn = ((preds == 0) & (df["is_hallucinated"] == 1)).sum()
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    results.append((thresh, precision, recall, f1))
    if f1 > best_f1:
        best_f1, best_thresh = f1, thresh

results_df = pd.DataFrame(results, columns=["threshold", "precision", "recall", "f1"])
print(results_df.sort_values("f1", ascending=False).head(10).to_string(index=False))
print(f"\nBest single threshold: {best_thresh:.3f}, F1={best_f1:.3f}")