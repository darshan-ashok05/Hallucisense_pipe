# api_server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from generator import get_response
from claim_extractor import extract_claims
from retrieval_verifier import factual_error_score
from confidence_analyzer import confidence_gap_score
from consistency_checker import consistency_fail_score
from fusion import h_score, classify
from corrector import generate_corrected_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VERDICT_MAP = {
    "Factual": "reliable",
    "Uncertain": "uncertain",
    "Hallucinated": "hallucinated",
}


def run_pipeline(query: str, response: str):
    claims = extract_claims(response)
    fe_scores = [factual_error_score(c) for c in claims] if claims else [0.5]
    cg = confidence_gap_score(query, response)
    cf = consistency_fail_score(query, response)
    fe_avg = max(fe_scores) if fe_scores else 0.5
    h = h_score(fe_avg, cg, cf)
    verdict = classify(h)
    flagged = [c for c, s in zip(claims, fe_scores) if s >= 0.6]

    return {
        "h_score": round(float(h), 4),
        "verdict": VERDICT_MAP[verdict],
        "fe": round(float(fe_avg), 4),
        "cg": round(float(cg), 4),
        "cf": round(float(cf), 4),
        "claims": [{"text": c, "score": round(float(s), 4)} for c, s in zip(claims, fe_scores)],
        "response": response,
        "_flagged": flagged,
    }


class AnalyzeRequest(BaseModel):
    query: str
    response: Optional[str] = ""
    correct: Optional[bool] = False


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    response = req.response.strip() if req.response else ""
    if not response:
        response = get_response(req.query)

    result = run_pipeline(req.query, response)

    if req.correct and result["_flagged"]:
        corrected, _ = generate_corrected_answer(req.query, response, result["_flagged"])
        result["corrected_answer"] = corrected

    del result["_flagged"]
    return result


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


@app.post("/api/chat")
def chat(req: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in req.history]
    reply = get_response(req.message, history=history)
    result = run_pipeline(req.message, reply)
    return {
        "reply": reply,
        "verdict": result["verdict"],
        "h_score": result["h_score"],
    }