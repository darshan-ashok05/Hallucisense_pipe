# fusion.py — should look exactly like this
def h_score(fe, cg, cf, alpha=0.2, beta=0.5, gamma=0.3):
    return alpha * fe + beta * cg + gamma * cf

def classify(h, low_thresh=0.22, high_thresh=0.27):
    if h < low_thresh: return "Factual"
    elif h < high_thresh: return "Uncertain"
    else: return "Hallucinated"