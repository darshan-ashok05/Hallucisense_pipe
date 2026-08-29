# test_cg.py
from confidence_analyzer import confidence_gap_score

test_responses = [
    "The capital of Karnataka is **Bengaluru** (also known as Bangalore).",
    "The capital of Karnataka is Bengaluru, also known as Bangalore.",
    "The capital of France is Paris.",
]

for r in test_responses:
    cg = confidence_gap_score(r)
    print(f"CG={cg:.3f} | {r}")