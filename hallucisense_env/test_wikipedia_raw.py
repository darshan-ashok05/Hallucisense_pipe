# test_wikipedia_raw.py
import wikipedia

print("Testing wikipedia.search()...")
try:
    results = wikipedia.search("Eiffel Tower", results=3)
    print(f"Search results: {results}")
except Exception as e:
    print(f"SEARCH FAILED: {type(e).__name__}: {e}")

print("\nTesting wikipedia.summary()...")
try:
    summary = wikipedia.summary("Eiffel Tower", sentences=2)
    print(f"Summary: {summary}")
except Exception as e:
    print(f"SUMMARY FAILED: {type(e).__name__}: {e}")