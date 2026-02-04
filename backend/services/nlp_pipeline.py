import spacy
from collections import defaultdict

nlp = spacy.load("en_core_web_sm")

import os
import json

# Load ontology from data file
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ONTOLOGY_PATH = os.path.join(BASE_DIR, 'data', 'skill_ontology.json')
try:
    with open(ONTOLOGY_PATH, 'r', encoding='utf-8') as f:
        ONTOLOGY = json.load(f)
except Exception:
    ONTOLOGY = {}

# create a reverse map for quick lookup: synonym -> canonical
REVERSE_ONTO = {}
for canonical, syns in ONTOLOGY.items():
    for s in syns:
        REVERSE_ONTO[s.lower()] = canonical


def _match_ontology(skill_text: str) -> str:
    s = skill_text.lower()
    # exact match
    if s in REVERSE_ONTO:
        return REVERSE_ONTO[s]
    # substring matching (longer phrases first)
    for syn, canon in sorted(REVERSE_ONTO.items(), key=lambda x: -len(x[0])):
        if syn in s:
            return canon
    return None


def clean_and_normalize(skills: list) -> list:
    """Lowercase, lemmatize, and map using the ontology JSON file."""
    normalized = []
    for s in skills:
        s0 = s.lower().strip()
        doc = nlp(s0)
        lemmas = " ".join([tok.lemma_ for tok in doc if not tok.is_stop])
        mapped = _match_ontology(lemmas) or _match_ontology(s0) or lemmas
        normalized.append(mapped)

    # dedupe while preserving order
    seen = set()
    out = []
    for x in normalized:
        if x not in seen and x:
            seen.add(x)
            out.append(x)
    return out
