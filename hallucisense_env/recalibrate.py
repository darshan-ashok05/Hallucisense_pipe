# recalibrate.py
import pandas as pd
import numpy as np

df = pd.read_csv("data/eval_results.csv").dropna(subset=["human_label"])
low = np.percentile(df["H_score"], 40)   # roughly splits Factual/Uncertain
high = np.percentile(df["H_score"], 75)  # top ~quartile flagged Hallucinated
print(f"Recommended thresholds: low={low:.3f}, high={high:.3f}")