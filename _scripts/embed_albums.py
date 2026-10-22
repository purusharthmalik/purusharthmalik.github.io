"""Embed album covers with CLIP and write the data the hero needs.

Output (_data/albums.json):
  albums: [{id, title, artist, words: [3 descriptors]}]
  sim:    upper-triangle cosine similarities, row-major, 3 decimals
"""
import json, sys
import numpy as np
import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

HERE = sys.argv[1]
OUT = sys.argv[2]
albums = json.load(open(f"{HERE}/albums.json"))

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").eval()
proc = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

images = [Image.open(f"{HERE}/covers/{a['id']}.jpg").convert("RGB") for a in albums]
with torch.no_grad():
    px = proc(images=images, return_tensors="pt")["pixel_values"]
    img = model.visual_projection(model.vision_model(pixel_values=px).pooler_output)
img = torch.nn.functional.normalize(img, dim=-1)

WORDS = [
    "dark", "moody", "pastel", "neon", "warm", "cold blue", "black and white", "grainy film",
    "vintage", "minimal", "bold typography", "handwritten text", "illustrated", "painted",
    "collage", "anime", "cartoon", "abstract shapes", "geometric", "surreal", "dreamy", "blurry",
    "portrait", "a face in close-up", "a couple", "a crowd", "a silhouette", "a band",
    "night city", "street", "rooftop", "bedroom", "car", "road trip", "ocean", "beach", "sky",
    "clouds", "sunset", "mountains", "forest", "flowers", "rain", "snow", "moon", "stars",
    "fire", "smoke", "glitter", "retro 80s", "lo-fi", "nostalgic", "lonely", "romantic",
    "playful", "melancholic", "chaotic", "calm", "pink", "red", "green", "yellow", "purple",
]
prompts = [f"an album cover, {w}" for w in WORDS]
with torch.no_grad():
    tok = proc.tokenizer(prompts, return_tensors="pt", padding=True)
    txt = model.text_projection(model.text_model(input_ids=tok["input_ids"], attention_mask=tok["attention_mask"]).pooler_output)
txt = torch.nn.functional.normalize(txt, dim=-1)

# Which words describe each cover *more than they describe the average cover*.
logits = (img @ txt.T).numpy()
distinct = logits - logits.mean(axis=0, keepdims=True)
sim = (img @ img.T).numpy()

# Drop near-identical covers (the same art uploaded as a single and on an album)
keep = []
for i in range(len(albums)):
    if all(sim[i, j] < 0.95 for j in keep):
        keep.append(i)
albums = [albums[i] for i in keep]
distinct = distinct[keep]
sim = sim[np.ix_(keep, keep)]

out_albums = []
for i, a in enumerate(albums):
    top = np.argsort(-distinct[i])[:3]
    out_albums.append({
        "id": a["id"],
        "title": a["title"],
        "artist": a["artist"],
        "uri": a["uri"],
        "words": [WORDS[j] for j in top],
    })

n = len(albums)
tri = [round(float(sim[i, j]), 3) for i in range(n) for j in range(i + 1, n)]
json.dump({"model": "CLIP ViT-B/32", "albums": out_albums, "sim": tri}, open(OUT, "w"), ensure_ascii=False)
print(n, "albums; sim range", float(sim[np.triu_indices(n, 1)].min()), float(sim[np.triu_indices(n, 1)].max()))
for a in out_albums[:12]:
    print(a["title"], "|", a["words"])
