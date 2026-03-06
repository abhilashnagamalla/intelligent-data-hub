from fastapi import FastAPI
from app.database import connect_db, disconnect_db
from app.routers import domains, datasets, chat

app = FastAPI(title="Intelligent Data Hub")


@app.on_event("startup")
async def startup():
    await connect_db()


@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()


@app.get("/")
async def root():
    return {"message": "Intelligent Data Hub Backend Running 🚀"}


app.include_router(domains.router)
app.include_router(chat.router)
app.include_router(datasets.router)