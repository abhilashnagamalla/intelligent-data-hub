from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chatbot_service import chatbot_response

router = APIRouter(prefix="/chatbot")

class ChatRequest(BaseModel):
    query: str

@router.post("/query")
def ask_bot(request: ChatRequest):

    return chatbot_response(request.query)