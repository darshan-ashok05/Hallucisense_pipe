# corrector.py
from generator import get_response
from retrieval_verifier import get_evidence

def generate_corrected_answer(query, hallucinated_response, flagged_claims, model="gemma2:2b"):
    """
    Uses retrieved Wikipedia evidence for flagged (high-FE) claims to prompt
    the LLM to regenerate a corrected response.
    """
    evidence_snippets = []
    for claim in flagged_claims:
        evidence = get_evidence(claim, k=1)
        if evidence:
            evidence_snippets.append(f"- Claim: \"{claim}\"\n  Verified fact: {evidence[0][:300]}")

    if not evidence_snippets:
        return None, "No reliable evidence was found to correct this response."

    evidence_text = "\n".join(evidence_snippets)

    correction_prompt = f"""The following response to a question was flagged as containing factual errors.
Use the verified facts below to rewrite ONLY the inaccurate parts. Keep the rest of the
response as close to the original as possible. Do not add commentary about the correction process.

Question: {query}

Original response: {hallucinated_response}

Verified facts to correct against:
{evidence_text}

Corrected response:"""

    corrected = get_response(correction_prompt, model=model, temperature=0.3)
    return corrected, None