# label_cli.py
import pandas as pd

def start_labeling(file_path="data/eval_results.csv"):
    df = pd.read_csv(file_path)
    
    # Force column to object/string type to avoid float64 dtype errors on empty columns
    if "human_label" not in df.columns:
        df["human_label"] = ""
    else:
        df["human_label"] = df["human_label"].fillna("").astype(str)

    total = len(df)
    print(f"\n--- Starting Labeling ({total} rows) ---\n")

    for i in range(len(df)):
        current_label = df.at[i, "human_label"].strip()
        
        # Skip already labeled rows
        if current_label in ["Factual", "Hallucinated", "Uncertain"]:
            continue

        row = df.iloc[i]
        print("=" * 60)
        print(f"[{i+1}/{total}] Category: {row.get('category', 'N/A')}")
        print(f"QUESTION   : {row['question']}")
        print(f"REFERENCE  : {row['best_answer_reference']}")
        print(f"MODEL RESP : {row['response']}")
        print("-" * 60)

        while True:
            choice = input("Select: [1] Factual  [2] Hallucinated  [3] Uncertain  (or 'q' to quit): ").strip().lower()
            if choice == '1':
                df.at[i, "human_label"] = "Factual"
                break
            elif choice == '2':
                df.at[i, "human_label"] = "Hallucinated"
                break
            elif choice == '3':
                df.at[i, "human_label"] = "Uncertain"
                break
            elif choice == 'q':
                df.to_csv(file_path, index=False)
                print(f"\nProgress saved to {file_path}. Exiting.")
                return
            else:
                print("Invalid input. Press 1, 2, 3, or q.")

    df.to_csv(file_path, index=False)
    print(f"\nSuccessfully labeled all {total} samples and saved to {file_path}!")

if __name__ == "__main__":
    start_labeling()