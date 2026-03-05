from fastapi import APIRouter
from app.services.data_service import (
    get_domain_datasets,
    fetch_live_data
)

router = APIRouter(prefix="/datasets", tags=["Datasets"])


# List metadata
@router.get("/{domain}")
async def list_datasets(domain: str):
    return await get_domain_datasets(domain)


# Fetch real data dynamically
@router.get("/live/{resource_id}")
async def live_data(resource_id: str):
    return await fetch_live_data(resource_id)
