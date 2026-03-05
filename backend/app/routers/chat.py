from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/chat", tags=["Chatbot"])


class ChatRequest(BaseModel):
    domain: str
    prompt: str


@router.post("/")
async def chat(request: ChatRequest):

    domain = request.domain
    user_prompt = request.prompt

    # 🔥 Domain-restricted logic (simple version)
    return {
        "summary": f"You asked about '{domain}'. Your query: {user_prompt}"
    }