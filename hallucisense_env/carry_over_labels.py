# carry_over_labels.py
import pandas as pd

old = pd.read_csv("data/eval_results_OLD_BACKUP.csv")
new = pd.read_csv("data/eval_results.csv")

label_map = dict(zip(old["question"], old["human_label"]))
new["human_label"] = new["question"].map(label_map)

matched = new["human_label"].notna().sum()
print(f"Carried over {matched} / {len(new)} labels")

new.to_csv("data/eval_results.csv", index=False)