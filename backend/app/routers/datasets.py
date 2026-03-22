import json
from pathlib import Path
from threading import RLock

from fastapi import APIRouter, HTTPException

from app.services.data_service import *
from app.services.dataset_visualizer import generate_charts
from app.services.dataset_explainer import explain_dataset

router = APIRouter(prefix="/datasets")

TRACKER_FILE = Path(__file__).resolve().parents[2] / "data" / "dataset_trackers.json"
tracker_lock = RLock()


def load_dataset_trackers():
    if not TRACKER_FILE.exists():
        return {}

    try:
        with TRACKER_FILE.open("r", encoding="utf-8") as tracker_file:
            data = json.load(tracker_file)
    except (OSError, json.JSONDecodeError):
        return {}

    if not isinstance(data, dict):
        return {}

    sanitized = {}
    for key, value in data.items():
        if not isinstance(value, dict):
            continue
        sanitized[key] = {
            "views": int(value.get("views", 0) or 0),
            "downloads": int(value.get("downloads", 0) or 0),
        }
    return sanitized


def save_dataset_trackers():
    TRACKER_FILE.parent.mkdir(parents=True, exist_ok=True)
    temp_file = TRACKER_FILE.with_suffix(".tmp")
    with temp_file.open("w", encoding="utf-8") as tracker_file:
        json.dump(dataset_trackers, tracker_file, indent=2, sort_keys=True)
    temp_file.replace(TRACKER_FILE)


@router.get("/all")
def get_all_datasets(page: int = 1, limit: int = 8):
    all_ds = []
    
    for sector in SECTORS:
        datasets = list_datasets(sector)
        for ds in datasets:
            tracker = dataset_trackers.get(get_tracker_key(sector, ds), {"views": 0, "downloads": 0})
            all_ds.append({
                "id": ds,
                "title": ds.replace("_", " ").replace(".csv", ""),
                "sector": sector,
                "datasets_count": 1,
                "views": tracker.get("views", 0),
                "downloads": tracker.get("downloads", 0)
            })
            
    total = len(all_ds)
    start = (page - 1) * limit
    end = start + limit
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": all_ds[start:end]
    }

@router.get("/{sector}")
def sector_datasets(sector: str):

    return {
        "sector": sector,
        "datasets": list_datasets(sector)
    }


dataset_trackers = load_dataset_trackers()

def get_tracker_key(sector: str, filename: str) -> str:
    return f"{sector}:{filename}"


def get_tracker(sector: str, filename: str):
    key = get_tracker_key(sector, filename)
    with tracker_lock:
        if key not in dataset_trackers:
            dataset_trackers[key] = {"views": 0, "downloads": 0}
            save_dataset_trackers()
        return dataset_trackers[key]


def load_dataset_or_404(sector: str, filename: str):
    try:
        return load_dataset(sector, filename)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Dataset not found") from exc


def build_dataset_stats(sector: str, filename: str):
    df = load_dataset_or_404(sector, filename)
    tracker = get_tracker(sector, filename)
    stats = dataset_summary(df)
    stats["views"] = tracker["views"]
    stats["downloads"] = tracker["downloads"]
    return stats, df


@router.get("/{sector}/{filename}/stats")
def dataset_stats(sector: str, filename: str):
    stats, _ = build_dataset_stats(sector, filename)
    return {"stats": stats}


@router.post("/{sector}/{filename}/view")
def dataset_view(sector: str, filename: str):
    load_dataset_or_404(sector, filename)
    with tracker_lock:
        tracker = get_tracker(sector, filename)
        tracker["views"] += 1
        save_dataset_trackers()
    stats, _ = build_dataset_stats(sector, filename)
    return {"stats": stats}


@router.get("/{sector}/{filename}")
def dataset_analysis(sector: str, filename: str):
    stats, df = build_dataset_stats(sector, filename)

    preview = dataset_preview(df)
    charts = generate_charts(df)
    explanation = explain_dataset(df)

    return {
        "preview": preview,
        "stats": stats,
        "charts": charts,
        "explanation": explanation
    }

from fastapi.responses import PlainTextResponse

@router.post("/{sector}/{filename}/download")
def dataset_download(sector: str, filename: str):
    load_dataset_or_404(sector, filename)
    with tracker_lock:
        t = get_tracker(sector, filename)
        t["downloads"] += 1
        save_dataset_trackers()
    return {"success": True, "downloads": t["downloads"]}

@router.get("/{sector}/{filename}/raw")
def dataset_raw(sector: str, filename: str):
    df = load_dataset_or_404(sector, filename)
    return PlainTextResponse(content=df.to_csv(index=False), media_type="text/csv")
