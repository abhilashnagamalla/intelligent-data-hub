import os

from .data_service import SECTORS, get_sector_path


def search_datasets(keyword):

    results = []

    keyword = keyword.lower()

    for sector, folder in SECTORS.items():

        path = get_sector_path(sector)

        for file in os.listdir(path):

            if keyword in file.lower():

                results.append({
                    "sector": sector,
                    "dataset": file
                })

    return results