# diagnose.py
import pandas as pd

df = pd.read_csv("data/eval_results.csv").dropna(subset=["human_label"])
df["human_label"] = df["human_label"].str.strip().str.capitalize()

print("=== Score distributions by true label ===\n")
for label in ["Factual", "Hallucinated"]:
    subset = df[df["human_label"] == label]
    print(f"--- {label} (n={len(subset)}) ---")
    print(subset[["FE", "CG", "CF", "H_score"]].describe().loc[["mean", "std", "min", "max"]])
    print()

print("=== H_score range overall ===")
print(df["H_score"].describe())

print("\n=== How many FE values are exactly 0.5 (fallback/no-evidence)? ===")
print((df["FE"] == 0.5).sum(), "out of", len(df))
