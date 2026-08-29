import pandas as pd

df = pd.read_csv("data/eval_results.csv").dropna(subset=["human_label"])
df["human_label"] = df["human_label"].str.strip().str.capitalize()

print("=== Score distributions by true label ===\n")

for label in ["Factual", "Hallucinated"]:
    subset = df[df["human_label"] == label]

    print(f"--- {label} (n={len(subset)}) ---")
    print(
        subset[["FE", "CG", "CF", "H_score"]]
        .describe()
        .loc[["mean", "std", "min", "max"]]
    )
    print()

print("=== H_score range overall ===")
print(df["H_score"].describe())

# --------------------------------------------------
# FE FALLBACK ANALYSIS
# --------------------------------------------------

fallback = df[df["FE"] == 0.5]

print("\n=== FE FALLBACK ANALYSIS ===")
print(f"Fallback FE values: {len(fallback)} out of {len(df)}")

print("\n=== Fallback by true label ===")
print(fallback["human_label"].value_counts())

print("\n=== All samples with FE = 0.5 ===")

columns_to_show = [
    "human_label",
    "FE",
    "CG",
    "CF",
    "H_score"
]

# Add question column if it exists
if "question" in df.columns:
    columns_to_show.insert(0, "question")

print(
    fallback[columns_to_show]
    .to_string(index=False)
)

# --------------------------------------------------
# SCORE DISTRIBUTION
# --------------------------------------------------

print("\n=== FE value counts ===")
print(df["FE"].value_counts().sort_index())

print("\n=== H_score sorted ===")
print(
    df[
        ["human_label", "FE", "CG", "CF", "H_score"]
    ]
    .sort_values("H_score")
    .to_string(index=False)
)