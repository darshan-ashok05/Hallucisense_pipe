# tune_weights_and_threshold.py
import pandas as pd
import numpy as np

df = pd.read_csv("data/eval_results.csv").dropna(subset=["human_label"])
df["human_label"] = df["human_label"].str.strip().str.capitalize()
df["is_hallucinated"] = (df["human_label"] == "Hallucinated").astype(int)

best_f1 = -1
best_config = None
results = []

weight_steps = np.arange(0.0, 1.01, 0.1)
threshold_steps = np.arange(0.25, 0.80, 0.02)  # matches your actual H-Score data range

for a in weight_steps:
    for b in weight_steps:
        g = round(1 - a - b, 2)
        if g < 0 or g > 1:
            continue
        h_scores = a * df["FE"] + b * df["CG"] + g * df["CF"]

        for thresh in threshold_steps:
            preds = (h_scores >= thresh).astype(int)
            tp = ((preds == 1) & (df["is_hallucinated"] == 1)).sum()
            fp = ((preds == 1) & (df["is_hallucinated"] == 0)).sum()
            fn = ((preds == 0) & (df["is_hallucinated"] == 1)).sum()
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

            if f1 > best_f1:
                best_f1 = f1
                best_config = (a, b, g, thresh, precision, recall)

a, b, g, thresh, precision, recall = best_config
print(f"Best config: alpha={a:.2f}, beta={b:.2f}, gamma={g:.2f}, threshold={thresh:.3f}")
print(f"Precision={precision:.3f}, Recall={recall:.3f}, F1={best_f1:.3f}")

# Also show top 10 for inspecting alternatives (e.g., ones using all 3 signals)
print("\n--- Exploring configs that use ALL three signals (gamma > 0.05, beta > 0.05) ---")
all_results = []
for a in weight_steps:
    for b in weight_steps:
        g = round(1 - a - b, 2)
        if g < 0.05 or b < 0.05:  # require meaningful use of both CG and CF
            continue
        h_scores = a * df["FE"] + b * df["CG"] + g * df["CF"]
        best_local_f1, best_local_thresh = -1, None
        for thresh in threshold_steps:
            preds = (h_scores >= thresh).astype(int)
            tp = ((preds == 1) & (df["is_hallucinated"] == 1)).sum()
            fp = ((preds == 1) & (df["is_hallucinated"] == 0)).sum()
            fn = ((preds == 0) & (df["is_hallucinated"] == 1)).sum()
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
            if f1 > best_local_f1:
                best_local_f1, best_local_thresh = f1, thresh
        all_results.append((a, b, g, best_local_thresh, best_local_f1))

all_results.sort(key=lambda x: -x[4])
for a, b, g, t, f1 in all_results[:5]:
    print(f"alpha={a:.2f}, beta={b:.2f}, gamma={g:.2f}, threshold={t:.3f}, F1={f1:.3f}")