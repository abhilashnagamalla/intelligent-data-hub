import httpx

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Dataset, DatasetRecord
from app.config import settings
from app.services.domain_resources import DOMAIN_RESOURCES

BASE_URL = "https://api.data.gov.in/resource"


async def fetch_full_dataset(resource_id):

    records = []
    offset = 0
    limit = 100

    async with httpx.AsyncClient(timeout=120) as client:

        while True:

            url = (
                f"{BASE_URL}/{resource_id}"
                f"?api-key={settings.DATA_GOV_API_KEY}"
                f"&format=json"
                f"&limit={limit}"
                f"&offset={offset}"
            )

            response = await client.get(url)

            if response.status_code != 200:
                print("API error:", response.text)
                break

            data = response.json()

            batch = data.get("records", [])

            if not batch:
                break

            records.extend(batch)

            offset += limit

    return records


async def sync_domain(domain_name, db: AsyncSession):

    resources = DOMAIN_RESOURCES.get(domain_name, [])

    print("datasets for", domain_name, ":", resources)

    for resource_id in resources:

        rows = await fetch_full_dataset(resource_id)

        print("Rows fetched:", len(rows))

        # check if dataset already exists
        result = await db.execute(
            select(Dataset).where(Dataset.id == resource_id)
        )

        dataset_exists = result.scalar_one_or_none()

        if not dataset_exists:

            dataset = Dataset(
                id=resource_id,
                domain=domain_name,
                title=resource_id,
                metadata_json={"resource_id": resource_id},
                source="data.gov.in"
            )

            db.add(dataset)

        # insert dataset rows
        for r in rows:

            db.add(
                DatasetRecord(
                    dataset_id=resource_id,
                    data=r
                )
            )

    await db.commit()

    print("domain sync completed:", domain_name)