# app.py
import streamlit as st
import streamlit.components.v1 as components
from generator import get_response
from claim_extractor import extract_claims
from retrieval_verifier import factual_error_score
from confidence_analyzer import confidence_gap_score
from consistency_checker import consistency_fail_score
from fusion import h_score, classify
from corrector import generate_corrected_answer

st.set_page_config(page_title="HalluciSense", page_icon="🧠", layout="wide", initial_sidebar_state="expanded")

# ============================================================
# GLOBAL CSS
# ============================================================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}

.stApp {
    background: linear-gradient(180deg, #f7f8fc 0%, #eef1f8 100%);
}

#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}

.app-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0 4px 0;
}
.app-header .logo {
    font-size: 34px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.app-header h1 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #4f46e5, #9333ea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.app-subtitle {
    color: #6b7280;
    font-size: 14px;
    margin-top: -6px;
    margin-bottom: 18px;
}

.card {
    background: #ffffff;
    border-radius: 16px;
    padding: 22px 24px;
    box-shadow: 0 2px 10px rgba(30, 41, 59, 0.06);
    border: 1px solid #eef0f4;
    margin-bottom: 18px;
}

.verdict-banner {
    padding: 18px 22px;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 600;
    margin: 14px 0;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fadeIn 0.4s ease;
}
.verdict-factual {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    color: #047857;
    border: 1px solid #a7f3d0;
}
.verdict-uncertain {
    background: linear-gradient(135deg, #fffbeb, #fef3c7);
    color: #b45309;
    border: 1px solid #fde68a;
}
.verdict-hallucinated {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    color: #b91c1c;
    border: 1px solid #fecaca;
}
.verdict-icon { font-size: 26px; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}

.claim-tag {
    padding: 6px 12px;
    border-radius: 999px;
    margin: 4px;
    display: inline-block;
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.4;
}

.metric-row { display: flex; gap: 14px; flex-wrap: wrap; margin: 10px 0 6px 0; }
.metric-pill {
    flex: 1;
    min-width: 130px;
    background: #f8f9fc;
    border: 1px solid #eceef4;
    border-radius: 12px;
    padding: 12px 16px;
    text-align: center;
}
.metric-pill .label { font-size: 12px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em;}
.metric-pill .value { font-size: 22px; font-weight: 700; color: #1f2937; margin-top: 2px; }

div.stButton > button {
    border-radius: 10px !important;
    font-weight: 600 !important;
    padding: 8px 20px !important;
    border: none !important;
    transition: all 0.15s ease;
}
div.stButton > button[kind="primary"] {
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    color: white !important;
}
div.stButton > button[kind="primary"]:hover {
    box-shadow: 0 4px 14px rgba(99,102,241,0.35) !important;
    transform: translateY(-1px);
}
div.stButton > button:not([kind="primary"]) {
    background: white !important;
    border: 1.5px solid #e5e7eb !important;
    color: #374151 !important;
}

.response-text {
    background: #fafbfe;
    border-left: 4px solid #8b5cf6;
    padding: 16px 18px;
    border-radius: 8px;
    font-size: 15px;
    line-height: 1.6;
    color: #1f2937;
    margin-bottom: 12px;
}
.corrected-text {
    background: #f0fdf4;
    border-left: 4px solid #22c55e;
    padding: 16px 18px;
    border-radius: 8px;
    font-size: 15px;
    line-height: 1.6;
    color: #1f2937;
}

[data-testid="stSidebar"] {
    background: #ffffff;
    border-right: 1px solid #eef0f4;
}
.sidebar-title { font-weight: 700; font-size: 16px; color: #1f2937; margin-bottom: 6px; }
.sidebar-info {
    background: #f8f9fc;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 16px;
}
.sidebar-stat {
    background: #f8f9fc;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12px;
    color: #4b5563;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
}
.sidebar-stat b { color: #1f2937; }

.stTabs [data-baseweb="tab-list"] { gap: 6px; }
.stTabs [data-baseweb="tab"] {
    border-radius: 10px 10px 0 0;
    font-weight: 600;
    padding: 10px 18px;
}
</style>
""", unsafe_allow_html=True)


# ============================================================
# ANIMATED H-SCORE GAUGE
# ============================================================
def render_gauge(score, verdict):
    color = {"Factual": "#10b981", "Uncertain": "#f59e0b", "Hallucinated": "#ef4444"}[verdict]
    pct = int(score * 100)
    html = f"""
    <html>
    <head>
    <style>
        body {{ margin:0; font-family:'Inter',sans-serif; background:transparent; }}
        .gauge-wrap {{ display:flex; align-items:center; justify-content:center; padding:10px; }}
        svg {{ transform: rotate(-90deg); }}
        .bg-ring {{ fill:none; stroke:#eef0f4; stroke-width:12; }}
        .fg-ring {{
            fill:none; stroke:{color}; stroke-width:12; stroke-linecap:round;
            stroke-dasharray: 314;
            stroke-dashoffset: 314;
            transition: stroke-dashoffset 1.2s ease-out;
        }}
        .gauge-label {{ position:absolute; text-align:center; }}
        .score-text {{ font-size:30px; font-weight:800; color:{color}; }}
        .score-sub {{ font-size:12px; color:#6b7280; font-weight:600; letter-spacing:0.04em; }}
    </style>
    </head>
    <body>
    <div class="gauge-wrap" style="position:relative; width:140px; height:140px;">
        <svg width="140" height="140" viewBox="0 0 120 120">
            <circle class="bg-ring" cx="60" cy="60" r="50"></circle>
            <circle id="fgRing" class="fg-ring" cx="60" cy="60" r="50"></circle>
        </svg>
        <div class="gauge-label" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);">
            <div class="score-text">{pct}%</div>
            <div class="score-sub">H-SCORE</div>
        </div>
    </div>
    <script>
        setTimeout(function() {{
            const ring = document.getElementById('fgRing');
            const circumference = 314;
            const offset = circumference - (circumference * {score});
            ring.style.strokeDashoffset = offset;
        }}, 100);
    </script>
    </body>
    </html>
    """
    components.html(html, height=160)


# ============================================================
# SIDEBAR
# ============================================================
with st.sidebar:
    st.markdown('<div class="sidebar-title">🧠 HalluciSense</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="sidebar-info">A hybrid framework that detects, scores, and corrects '
        'hallucinated content in LLM responses using retrieval verification, semantic-entropy '
        'confidence analysis, and consistency checking.</div>',
        unsafe_allow_html=True
    )
    st.markdown("**Pipeline**")
    st.caption("🔎 Knowledge Verifier — Wikipedia retrieval + NLI entailment")
    st.caption("📊 Confidence Analyzer — semantic entropy across resamples")
    st.caption("🔁 Consistency Checker — paraphrase-based response stability")
    st.markdown("---")
    st.markdown("**Model Performance**")
    st.markdown('<div class="sidebar-stat">F1-Score <b>0.731</b></div>', unsafe_allow_html=True)
    st.markdown('<div class="sidebar-stat">Precision <b>0.68</b></div>', unsafe_allow_html=True)
    st.markdown('<div class="sidebar-stat">Recall <b>0.79</b></div>', unsafe_allow_html=True)
    st.markdown("---")
    st.caption("Built for JSS Academy of Technical Education · Project Phase-II")


# ============================================================
# HEADER
# ============================================================
st.markdown("""
<div class="app-header">
    <div class="logo">🧠</div>
    <h1>HalluciSense</h1>
</div>
<div class="app-subtitle">Confidence-Aware Hybrid Hallucination Detection Framework</div>
""", unsafe_allow_html=True)


tab1, tab2, tab3 = st.tabs(["📋  Check Pasted Text", "💬  Chatbot", "🔍  Ask a Question"])


# ============================================================
# SHARED LOGIC
# ============================================================
def run_full_analysis(query, response):
    claims = extract_claims(response)

    progress = st.empty()

    progress.info("🔎 Verifying facts against Wikipedia...")
    fe_scores = [factual_error_score(c) for c in claims] if claims else [0.5]

    progress.info("📊 Analyzing model confidence (resampling)...")
    cg = confidence_gap_score(query, response)

    progress.info("🔁 Checking response consistency...")
    cf = consistency_fail_score(query, response)

    progress.empty()

    fe_avg = max(fe_scores) if fe_scores else 0.5
    h = h_score(fe_avg, cg, cf)
    verdict = classify(h)
    return {
        "claims": claims, "fe_scores": fe_scores, "fe_avg": fe_avg,
        "cg": cg, "cf": cf, "h": h, "verdict": verdict,
        "query": query, "response": response
    }


VERDICT_DISPLAY = {
    "Factual":      ("verdict-factual", "✅", "This response looks factually reliable."),
    "Uncertain":    ("verdict-uncertain", "⚠️", "Some uncertainty detected — worth double-checking."),
    "Hallucinated": ("verdict-hallucinated", "🚫", "This response likely contains hallucinated content."),
}


def display_results(result, key_prefix):
    css_class, icon, message = VERDICT_DISPLAY[result["verdict"]]

    col_gauge, col_banner = st.columns([1, 3])
    with col_gauge:
        render_gauge(result["h"], result["verdict"])
    with col_banner:
        st.markdown(
            f'<div class="verdict-banner {css_class}"><span class="verdict-icon">{icon}</span>{message}</div>',
            unsafe_allow_html=True
        )
        show_details = st.toggle("Show technical details", key=f"{key_prefix}_toggle")

    flagged_claims = [c for c, s in zip(result["claims"], result["fe_scores"]) if s >= 0.6]

    if show_details:
        st.markdown(f"""
        <div class="metric-row">
            <div class="metric-pill"><div class="label">H-Score</div><div class="value">{result['h']:.3f}</div></div>
            <div class="metric-pill"><div class="label">Factual Error</div><div class="value">{result['fe_avg']:.2f}</div></div>
            <div class="metric-pill"><div class="label">Confidence Gap</div><div class="value">{result['cg']:.2f}</div></div>
            <div class="metric-pill"><div class="label">Consistency Fail</div><div class="value">{result['cf']:.2f}</div></div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("**Sentence-level breakdown**")
        heatmap_html = ""
        for claim, score in zip(result["claims"], result["fe_scores"]):
            if score < 0.35:
                color = "#d1fae5"
            elif score < 0.6:
                color = "#fef3c7"
            else:
                color = "#fecaca"
            heatmap_html += f'<span class="claim-tag" style="background-color:{color};">{claim} · {score:.2f}</span>'
        st.markdown(heatmap_html, unsafe_allow_html=True)

    if flagged_claims:
        st.markdown("<br>", unsafe_allow_html=True)
        correction_key = f"{key_prefix}_correction"
        if st.button("✨ Generate Corrected Answer", key=f"{key_prefix}_correct_btn", type="primary"):
            with st.spinner("Looking up facts and rewriting response..."):
                corrected, error = generate_corrected_answer(result["query"], result["response"], flagged_claims)
            st.session_state[correction_key] = (corrected, error)

        if correction_key in st.session_state:
            corrected, error = st.session_state[correction_key]
            if error:
                st.error(error)
            else:
                st.markdown("**Corrected response**")
                st.markdown(f'<div class="corrected-text">{corrected}</div>', unsafe_allow_html=True)
    elif result["verdict"] == "Uncertain":
        st.caption("No specific factual errors were confidently identified — correction not applicable.")


# ============================================================
# TAB 1 — Check Pasted Text
# ============================================================
with tab1:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("Paste a response from any LLM (ChatGPT, Claude, Gemini, etc.) to check it for hallucinations.")
    ext_query = st.text_input("Original question:", key="tab1_query", placeholder="What was the question asked?")
    ext_response = st.text_area("Paste the response text:", height=180, key="tab1_response")
    if st.button("Check Response", key="tab1_analyze", type="primary") and ext_query and ext_response:
        st.session_state["tab1_result"] = run_full_analysis(ext_query, ext_response)
    st.markdown('</div>', unsafe_allow_html=True)

    if "tab1_result" in st.session_state:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        display_results(st.session_state["tab1_result"], key_prefix="tab1")
        st.markdown('</div>', unsafe_allow_html=True)


# ============================================================
# TAB 2 — Chatbot
# ============================================================
with tab2:
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    for i, msg in enumerate(st.session_state.chat_history):
        with st.chat_message(msg["role"]):
            st.write(msg["content"])
            if msg["role"] == "assistant" and "verdict" in msg:
                css_class, icon, _ = VERDICT_DISPLAY[msg["verdict"]]
                st.markdown(
                    f'<span style="font-size:13px; font-weight:600;">{icon} {msg["verdict"]} '
                    f'<span style="color:#9ca3af;">· H-Score {msg["h_score"]:.2f}</span></span>',
                    unsafe_allow_html=True
                )
                if msg["verdict"] == "Hallucinated" and msg.get("flagged"):
                    correction_key = f"chat_correction_{i}"
                    if st.button("✨ Generate corrected answer", key=f"chat_correct_btn_{i}"):
                        corrected, error = generate_corrected_answer(msg["query"], msg["content"], msg["flagged"])
                        st.session_state[correction_key] = (corrected, error)
                    if correction_key in st.session_state:
                        corrected, error = st.session_state[correction_key]
                        if corrected:
                            st.markdown(f'<div class="corrected-text">{corrected}</div>', unsafe_allow_html=True)
                elif msg["verdict"] == "Uncertain":
                    st.caption("No specific factual errors were confidently identified — correction not applicable.")

    user_msg = st.chat_input("Type a message...")
    if user_msg:
        st.session_state.chat_history.append({"role": "user", "content": user_msg})

        llm_history = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in st.session_state.chat_history[:-1]
        ]

        with st.spinner("Thinking..."):
            reply = get_response(user_msg, history=llm_history)

        result = run_full_analysis(user_msg, reply)
        flagged = [c for c, s in zip(result["claims"], result["fe_scores"]) if s >= 0.6]
        st.session_state.chat_history.append({
            "role": "assistant", "content": reply, "verdict": result["verdict"],
            "h_score": result["h"], "query": user_msg, "flagged": flagged
        })
        st.rerun()


# ============================================================
# TAB 3 — Ask a Question
# ============================================================
with tab3:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    query = st.text_input("Ask anything:", key="tab3_query",
                           placeholder="e.g. Can you see the Great Wall of China from space?")
    if st.button("Ask HalluciSense", key="tab3_analyze", type="primary") and query:
        with st.spinner("Generating response..."):
            response = get_response(query)
        st.session_state["tab3_result"] = run_full_analysis(query, response)
    st.markdown('</div>', unsafe_allow_html=True)

    if "tab3_result" in st.session_state:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(f'<div class="response-text">{st.session_state["tab3_result"]["response"]}</div>', unsafe_allow_html=True)
        display_results(st.session_state["tab3_result"], key_prefix="tab3")
        st.markdown('</div>', unsafe_allow_html=True)