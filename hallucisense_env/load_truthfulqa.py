# load_truthfulqa.py
import pandas as pd

def load_truthfulqa(path="data/truthfulqa.csv", n_samples=None, seed=42):
    """
    Loads TruthfulQA dataset.
    Columns include: Type, Category, Question, Best Answer, Correct Answers,
    Incorrect Answers, Source
    """
    df = pd.read_csv(path)
    df = df[["Type", "Category", "Question", "Best Answer", "Correct Answers", "Incorrect Answers"]]
    df = df.dropna(subset=["Question", "Best Answer"])

    if n_samples:
        df = df.sample(n=n_samples, random_state=seed).reset_index(drop=True)

    return df

if __name__ == "__main__":
    df = load_truthfulqa(n_samples=50)
    print(f"Loaded {len(df)} questions")
    print(df[["Category", "Question"]].head(10))