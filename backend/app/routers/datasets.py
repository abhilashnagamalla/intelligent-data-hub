from fastapi import APIRouter

from app.services.data_service import *
from app.services.dataset_visualizer import generate_charts
from app.services.dataset_explainer import explain_dataset

router = APIRouter(prefix="/datasets")


@router.get("/{sector}")
def sector_datasets(sector: str):

    return {
        "sector": sector,
        "datasets": list_datasets(sector)
    }


@router.get("/{sector}/{filename}")
def dataset_analysis(sector: str, filename: str):

    df = load_dataset(sector, filename)

    preview = dataset_preview(df)

    stats = dataset_summary(df)

    charts = generate_charts(df)

    explanation = explain_dataset(df)

    return {
        "preview": preview,
        "stats": stats,
        "charts": charts,
        "explanation": explanation
    }