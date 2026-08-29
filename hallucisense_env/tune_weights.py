# tune_weights.py
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from itertools import product

def tune_weights_gridsearch(path="data/eval_results.csv"):
    """Simple grid search over alpha/beta/gamma (easy to explain in your report)"""
    df = pd.read_csv(path).dropna(subset=["human_label"])
    df["human_label"] = df["human_label"].str.strip().str.capitalize()
    df["is_hallucinated"] = (df["human_label"] == "Hallucinated").astype(int)

    best_f1 = -1
    best_weights = None
    results = []

    # search weights in steps of 0.1 where alpha+beta+gamma = 1
    steps = np.arange(0.0, 1.01, 0.1)
    for a in steps:
        for b in steps:
            g = round(1 - a - b, 2)
            if g < 0 or g > 1:
                continue
            h_scores = a * df["FE"] + b * df["CG"] + g * df["CF"]
            preds = (h_scores >= 0.7).astype(int)  # matches your Hallucinated threshold
            tp = ((preds == 1) & (df["is_hallucinated"] == 1)).sum()
            fp = ((preds == 1) & (df["is_hallucinated"] == 0)).sum()
            fn = ((preds == 0) & (df["is_hallucinated"] == 1)).sum()
            precision = tp / (tp + fp) if (tp + fp) > 0 else 0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0
            f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
            results.append((a, b, g, precision, recall, f1))
            if f1 > best_f1:
                best_f1 = f1
                best_weights = (a, b, g)

    results_df = pd.DataFrame(results, columns=["alpha", "beta", "gamma", "precision", "recall", "f1"])
    results_df = results_df.sort_values("f1", ascending=False)

    print("Top 10 weight combinations by F1:")
    print(results_df.head(10).to_string(index=False))
    print(f"\nBest weights: alpha={best_weights[0]:.2f}, beta={best_weights[1]:.2f}, gamma={best_weights[2]:.2f}")
    print(f"Best F1: {best_f1:.3f}")

    return best_weights


def tune_weights_logreg(path="data/eval_results.csv"):
    """Alternative: learned weights via logistic regression (matches your paper's Eq. 7 more closely)"""
    df = pd.read_csv(path).dropna(subset=["human_label"])
    df["human_label"] = df["human_label"].str.strip().str.capitalize()
    df["is_hallucinated"] = (df["human_label"] == "Hallucinated").astype(int)

    X = df[["FE", "CG", "CF"]].values
    y = df["is_hallucinated"].values

    clf = LogisticRegression()
    clf.fit(X, y)

    coefs = clf.coef_[0]
    # normalize to sum to 1 (matches your a+b+g=1 constraint)
    coefs_norm = coefs / coefs.sum() if coefs.sum() != 0 else coefs

    print("Logistic Regression learned weights (raw coefficients):")
    print(f"  FE (alpha): {coefs[0]:.4f}")
    print(f"  CG (beta):  {coefs[1]:.4f}")
    print(f"  CF (gamma): {coefs[2]:.4f}")
    print(f"\nNormalized (sum=1):")
    print(f"  alpha={coefs_norm[0]:.3f}, beta={coefs_norm[1]:.3f}, gamma={coefs_norm[2]:.3f}")

    train_acc = clf.score(X, y)
    print(f"\nTraining accuracy: {train_acc:.3f}")

    return coefs_norm


if __name__ == "__main__":
    print("=== Grid Search Method ===")
    tune_weights_gridsearch()

    print("\n\n=== Logistic Regression Method ===")
    tune_weights_logreg()