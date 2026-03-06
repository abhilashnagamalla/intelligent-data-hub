from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.data_service import sync_domain

router = APIRouter(prefix="/domains", tags=["Domains"])


@router.post("/fetch")
async def fetch_domain(domain: str, db: AsyncSession = Depends(get_db)):

    await sync_domain(domain, db)

    return {"message": f"Datasets synced for {domain}"}