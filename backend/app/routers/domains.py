from fastapi import APIRouter
from app.services.data_service import fetch_domain_metadata

router = APIRouter(prefix="/domains", tags=["Domains"])

@router.post("/fetch")
async def fetch_domain(domain: str):
    await fetch_domain_metadata(domain)
    return {"message": f"Metadata stored for {domain}"}
