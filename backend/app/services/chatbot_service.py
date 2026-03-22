import spacy
from .resource_discovery import search_datasets

nlp = spacy.load("en_core_web_sm")

SECTOR_ALIASES = {
    "health": {"health", "healthcare"},
    "education": {"education", "school", "schools"},
    "transport": {"transport", "transportation", "vehicle", "vehicles"},
    "agriculture": {"agriculture", "agri", "farmer", "farmers"},
    "census": {"census", "population", "demographic", "demographics"},
    "finance": {"finance", "financial", "bank", "banking", "economy", "economic"},
}

IGNORED_KEYWORDS = {
    "dataset", "datasets", "data", "count", "counts", "number", "numbers",
    "show", "tell", "give", "find", "related", "prompt", "response"
}


def detect_intent(query):
    doc = nlp(query)
    return [token.text for token in doc if token.pos_ in ["NOUN", "PROPN", "ADJ"]]


def chatbot_response(query):
    keywords = detect_intent(query)
    lowered_query = query.lower()
    matched_sectors = [
        sector
        for sector, aliases in SECTOR_ALIASES.items()
        if any(alias in lowered_query for alias in aliases)
    ]

    cleaned_keywords = []
    for word in keywords:
        normalized = word.lower().strip()
        if not normalized or normalized in IGNORED_KEYWORDS:
            continue
        if any(normalized in aliases for aliases in SECTOR_ALIASES.values()):
            continue
        if normalized not in cleaned_keywords:
            cleaned_keywords.append(normalized)

    results = search_datasets(cleaned_keywords, matched_sectors or None)

    if results:
        target_label = " and ".join(cleaned_keywords) if cleaned_keywords else "your request"
        if matched_sectors:
            sector_label = matched_sectors[0].title()
            first_line = f"Found {len(results)} datasets related to {target_label} in {sector_label}."
        else:
            first_line = f"Found {len(results)} datasets related to {target_label}."

        top_matches = [item["dataset"].replace("_", " ").replace(".csv", "") for item in results[:5]]
        content = first_line
        if top_matches:
            content += "\nTop matches:\n" + "\n".join(f"{idx + 1}. {name}" for idx, name in enumerate(top_matches))

        return {
            "content": content,
            "count": len(results),
            "results": results[:10],
        }

    return {"content": "No datasets found."}
