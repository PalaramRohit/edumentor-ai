import re
import spacy

nlp = spacy.load("en_core_web_sm")

# Very simple fallback: nouns and tech-like tokens
TECH_WORDS = set([
    "python","java","c++","sql","nosql","mongo","mongodb","docker","kubernetes","aws",
    "tensorflow","pytorch","sklearn","scikit-learn","nlp","rest","graphql","react","nodejs","flask"
])


def extract_skills_rule_based(text: str) -> list:
    text = text.lower()
    # catch tech words explicitly
    found = set(re.findall(r"[a-zA-Z+#]+", text)) & TECH_WORDS

    # noun chunks
    doc = nlp(text)
    for chunk in doc.noun_chunks:
        token = chunk.root.lemma_.lower()
        if len(token) > 2 and token.isalpha():
            found.add(token)

    # heuristics: sequences like "experience with X" or "knowledge of Y"
    patterns = [r"experience with ([a-zA-Z0-9+#\- ]+)", r"knowledge of ([a-zA-Z0-9+#\- ]+)"]
    for p in patterns:
        for m in re.findall(p, text):
            part = m.strip().split(',')[0]
            found.add(part)

    return sorted(found)
