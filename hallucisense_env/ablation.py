# ablation.py
import pandas as pd
from sklearn.metrics import f1_score

df = pd.read_csv("data/eval_results.csv").dropna(subset=["human_label"])
df["is_hallucinated"] = (df["human_label"].str.strip().str.capitalize() == "Hallucinated").astype(int)

configs = {
    "FE only": (1, 0, 0),
    "CG only": (0, 1, 0),
    "CF only": (0, 0, 1),
    "Full Hybrid (tuned)": (0.2, 0.5, 0.3),
}

THRESHOLD = 0.27

print(f"{'Config':<20} {'F1':<8}")
for name, (a, b, g) in configs.items():
    h = a * df["FE"] + b * df["CG"] + g * df["CF"]
    preds = (h >= THRESHOLD).astype(int)
    f1 = f1_score(df["is_hallucinated"], preds, zero_division=0)
    print(f"{name:<20} {f1:.3f}")