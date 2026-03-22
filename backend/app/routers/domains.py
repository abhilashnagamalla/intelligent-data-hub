from fastapi import APIRouter
from app.services.data_service import SECTORS, dataset_count, list_datasets
from app.routers.datasets import dataset_trackers, get_tracker_key

router = APIRouter(prefix="/domains")

@router.get("/")
def get_domains():
    domains = []

    for sector in SECTORS:
        datasets = list_datasets(sector)
        total_datasets = dataset_count(sector)
        total_views = 0
        total_downloads = 0
        file_stats = []
        
        for ds in datasets:
            tracker = dataset_trackers.get(get_tracker_key(sector, ds), {"views": 0, "downloads": 0})
            total_views += tracker.get("views", 0)
            total_downloads += tracker.get("downloads", 0)
            
            clean_name = ds.replace("_", " ").replace(".csv", "")
            file_stats.append({
                "name": clean_name,
                "views": tracker.get("views", 0)
            })
            
        file_stats.sort(key=lambda x: x["views"], reverse=True)
        top_datasets = [fs["name"] for fs in file_stats[:3]]

        if datasets and all(fs["views"] == 0 for fs in file_stats):
            top_datasets = [ds.replace("_", " ").replace(".csv", "") for ds in datasets[:3]]

        domains.append({
            "sector": sector,
            "catalogs": total_datasets,
            "datasets": total_datasets,
            "views": total_views,
            "downloads": total_downloads,
            "topDatasets": top_datasets
        })

    return domains
