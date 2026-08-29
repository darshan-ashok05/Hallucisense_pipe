from confidence_analyzer import confidence_gap_score

test_cases = [
    ("What is the capital of France?", "The capital of France is Paris."),
    ("What did Paul Revere say during his ride?", "Paul Revere shouted 'The redcoats are attacking with lasers!'"),
]

for query, response in test_cases:
    cg = confidence_gap_score(query, response)
    print(f"CG={cg:.3f} | Q: {query} | A: {response}")