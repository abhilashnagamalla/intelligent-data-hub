from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Dataset

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.get("/{domain}")

async def get_domain_catalog(domain: str, db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Dataset).where(Dataset.domain == domain)
    )

    datasets = result.scalars().all()

    return datasets