import spacy
from .resource_discovery import search_datasets

nlp = spacy.load("en_core_web_sm")


def detect_intent(query):

    doc = nlp(query)

    keywords = [token.text for token in doc if token.pos_ in ["NOUN","PROPN"]]

    return keywords


def chatbot_response(query):

    keywords = detect_intent(query)

    for word in keywords:

        results = search_datasets(word)

        if results:

            return {
                "intent": word,
                "results": results[:10]
            }

    return {"message": "No datasets found"}