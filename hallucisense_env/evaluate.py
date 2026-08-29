# evaluate.py
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from fusion import h_score, classify

def evaluate(path="data/eval_results.csv"):
    df = pd.read_csv(path)
    df = df.dropna(subset=["human_label"])
    df["human_label"] = df["human_label"].str.strip().str.capitalize()

    # RECOMPUTE H-Score and verdict using CURRENT fusion.py weights/thresholds
    # instead of using the stale predicted_verdict column from when the CSV was built
    df["H_recomputed"] = df.apply(lambda r: h_score(r["FE"], r["CG"], r["CF"]), axis=1)
    df["predicted_verdict"] = df["H_recomputed"].apply(classify)

    print(f"Evaluating on {len(df)} labeled samples\n")

    labels = ["Factual", "Uncertain", "Hallucinated"]

    print("=== 3-Class Report (Factual / Uncertain / Hallucinated) ===")
    print(classification_report(df["human_label"], df["predicted_verdict"], labels=labels, zero_division=0))

    df["human_binary"] = df["human_label"].apply(lambda x: "Hallucinated" if x == "Hallucinated" else "Not Hallucinated")
    df["pred_binary"] = df["predicted_verdict"].apply(lambda x: "Hallucinated" if x == "Hallucinated" else "Not Hallucinated")

    print("\n=== Binary Report (Hallucinated vs Not) ===")
    print(classification_report(df["human_binary"], df["pred_binary"], zero_division=0))

    print("\n=== Confusion Matrix (Binary) ===")
    cm = confusion_matrix(df["human_binary"], df["pred_binary"], labels=["Hallucinated", "Not Hallucinated"])
    print(pd.DataFrame(cm, index=["Actual: Hallucinated", "Actual: Not"],
                        columns=["Pred: Hallucinated", "Pred: Not"]))

    return df

if __name__ == "__main__":
    evaluate()