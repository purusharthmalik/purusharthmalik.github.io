"""Real attention weights for the home-page headline.

Runs the headline through a small causal LM and writes, for every layer, each
token's attention over the earlier tokens (averaged over heads) to
_data/headline_attention.json.

The model's first position soaks up most attention (the "attention sink"), so
we prepend a BOS token, then drop it and renormalise over the visible words.

Usage: python _scripts/headline_attention.py "<headline>" _data/headline_attention.json
"""
import json, sys
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL = "HuggingFaceTB/SmolLM2-360M"
text, out = sys.argv[1], sys.argv[2]

tok = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForCausalLM.from_pretrained(MODEL, attn_implementation="eager").eval()

bos = tok.bos_token_id if tok.bos_token_id is not None else tok.eos_token_id
ids = [bos] + tok(text, add_special_tokens=False)["input_ids"]
with torch.no_grad():
    att = model(torch.tensor([ids]), output_attentions=True).attentions  # L x (1, H, T, T)

pieces = [tok.convert_tokens_to_string([t]) for t in tok.convert_ids_to_tokens(ids[1:])]
layers = []
for a in att:
    m = a[0].mean(0)[1:, 1:]              # average heads, drop the BOS row and column
    rows = []
    for i in range(m.shape[0]):
        r = m[i, : i + 1]
        r = r / r.sum()
        rows.append([round(float(x), 3) for x in r])
    layers.append(rows)

json.dump({"model": MODEL.split("/")[-1], "tokens": pieces, "layers": layers},
          open(out, "w"), ensure_ascii=False)
print(len(pieces), "tokens:", pieces)
print(len(layers), "layers")
