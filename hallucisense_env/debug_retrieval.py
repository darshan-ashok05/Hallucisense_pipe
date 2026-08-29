# debug_retrieval.py
from retrieval_verifier import get_evidence, factual_error_score

test_claims = [
    "The Eiffel Tower is located in Paris.",
    "Water boils at 100 degrees Celsius at sea level.",
    "Napoleon was born in Corsica.",
    "The moon is made of cheese.",          # should score high FE (contradiction)
    "The capital of France is Berlin.",     # should score high FE (contradiction)
]

for claim in test_claims:
    print(f"\nClaim: {claim}")
    evidence = get_evidence(claim)
    print(f"Evidence found: {len(evidence)}")
    score = factual_error_score(claim, debug=True)
    print(f"FE score: {score}")