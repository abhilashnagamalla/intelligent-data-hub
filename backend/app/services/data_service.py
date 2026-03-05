from urllib.parse import quote
import httpx

from app.config import settings

CATALOG_URL = "https://api.data.gov.in/resource"


async def fetch_domain_metadata(domain_name: str):

    encoded_domain = quote(domain_name)

    url = (
        f"{CATALOG_URL}"
        f"?api-key={settings.DATA_GOV_API_KEY}"
        f"&format=json"
        f"&filters[sector]={encoded_domain}"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            return {"error": "API request failed"}

        data = response.json()

    return data


async def get_domain_datasets(domain_name: str):
    return await fetch_domain_metadata(domain_name)


async def fetch_live_data(resource_id: str):

    url = (
        f"https://api.data.gov.in/resource/{resource_id}"
        f"?api-key={settings.DATA_GOV_API_KEY}"
        f"&format=json"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        if response.status_code != 200:
            return {"error": "Failed to fetch live data"}

        return response.json()