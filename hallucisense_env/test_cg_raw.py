# test_cg_raw.py
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

model = GPT2LMHeadModel.from_pretrained("distilgpt2")
tokenizer = GPT2Tokenizer.from_pretrained("distilgpt2")
model.eval()

def raw_perplexity(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs, labels=inputs["input_ids"])
    return torch.exp(outputs.loss).item()

test_cases = [
    ("The capital of France is Paris.", "true/simple"),
    ("The capital of Karnataka is Bengaluru, also known as Bangalore.", "true/simple"),
    ("Water boils at 100 degrees Celsius at sea level.", "true/simple"),
    ("The moon is made of cheese.", "false/absurd"),
    ("The capital of France is Berlin.", "false"),
    ("Napoleon was born on Mars in the year 3021 during a solar eclipse.", "false/absurd"),
]

print(f"{'Perplexity':<12} {'Category':<15} Text")
for text, category in test_cases:
    ppl = raw_perplexity(text)
    print(f"{ppl:<12.2f} {category:<15} {text}")