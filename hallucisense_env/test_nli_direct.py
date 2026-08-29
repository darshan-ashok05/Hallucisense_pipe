# test_nli_direct.py
from retrieval_verifier import classify_entailment

claim = "The Eiffel Tower is located in Paris."
evidence = "The Eiffel Tower is a lattice tower on the Champ de Mars in Paris, France."

label, confidence = classify_entailment(claim, evidence)
print(f"Label: {label}, Confidence: {confidence:.4f}")
assert "entail" in label, "Expected entailment for this obvious true claim!"
print("PASSED: entailment correctly detected.")