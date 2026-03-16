from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import datasets, domains, chatbot

app = FastAPI(title="Intelligent Data Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router)
app.include_router(domains.router)
app.include_router(chatbot.router)


@app.get("/")
def root():
    return {"message": "Intelligent Data Hub API running"}