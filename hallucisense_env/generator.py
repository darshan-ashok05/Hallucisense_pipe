# generator.py
import ollama

def get_response(query, model="gemma2:2b", temperature=0.7, history=None):
    """
    history: optional list of {"role": "user"/"assistant", "content": "..."} dicts
    for multi-turn context. If not provided, behaves exactly as before.
    """
    if history:
        messages = history + [{"role": "user", "content": query}]
        resp = ollama.chat(model=model, messages=messages, options={"temperature": temperature})
        return resp["message"]["content"]
    else:
        resp = ollama.generate(model=model, prompt=query, options={"temperature": temperature})
        return resp["response"]


def paraphrase_query(query, model="gemma2:2b", n=3):
    variants = []
    for _ in range(n):
        prompt = f"Rewrite this question with different words but the same meaning. Only output the rewritten question:\n{query}"
        variants.append(get_response(prompt, model, temperature=0.9))
    return variants