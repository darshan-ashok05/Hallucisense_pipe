# claim_extractor.py
import re
import spacy
nlp = spacy.load("en_core_web_sm")

def _clean_text(text):
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)   # remove bold **text**
    text = re.sub(r"^\s*\*\s*", "", text, flags=re.MULTILINE)  # remove leading bullet asterisks
    text = re.sub(r"^\s*[-•]\s*", "", text, flags=re.MULTILINE)  # remove other bullet markers
    return text

def extract_claims(text):
    text = _clean_text(text)
    doc = nlp(text)
    claims = []
    for sent in doc.sents:
        cleaned = sent.text.strip()
        cleaned = re.sub(r"^[*\-•:]+\s*", "", cleaned)  # strip any leftover leading bullet/colon chars
        word_count = len([tok for tok in nlp(cleaned) if tok.is_alpha])
        if word_count >= 4:  # slightly stricter than before, filters short label-like fragments
            claims.append(cleaned)
    return claims