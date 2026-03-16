from fastapi import APIRouter

from app.services.data_service import SECTORS, dataset_count

router = APIRouter(prefix="/domains")


@router.get("/")
def get_domains():

    domains = []

    for sector in SECTORS:

        domains.append({
            "sector": sector,
            "datasets": dataset_count(sector)
        })

    return domains