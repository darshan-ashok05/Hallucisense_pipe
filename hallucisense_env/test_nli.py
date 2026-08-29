# test_nli.py
from transformers import pipeline

nli = pipeline("text-classification", model="cross-encoder/nli-deberta-v3-xsmall")

claim = "The Eiffel Tower is located in Paris."
evidence = "The Eiffel Tower is a lattice tower on the Champ de Mars in Paris, France."

# Method 1: your current approach (likely broken)
print("=== Method 1: concatenated string with [SEP] ===")
result1 = nli(f"{claim} [SEP] {evidence}")
print(result1)

# Method 2: proper text/text_pair format
print("\n=== Method 2: text_pair argument ===")
result2 = nli({"text": claim, "text_pair": evidence})
print(result2)

# Method 3: passing as tuple
print("\n=== Method 3: tuple input ===")
result3 = nli([(claim, evidence)])
print(result3)