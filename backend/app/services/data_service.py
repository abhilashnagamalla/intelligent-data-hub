import os
import pandas as pd

DATASET_FOLDER = "datasets"

SECTORS = {
    "health": "health_datasets",
    "education": "education_datasets",
    "transport": "transport_datasets",
    "agriculture": "agriculture_datasets",
    "census": "census_datasets",
    "finance": "finance_datasets"
}


def get_sector_path(sector):

    folder = SECTORS.get(sector)

    if not folder:
        return None

    return os.path.join(DATASET_FOLDER, folder)


def list_datasets(sector):

    path = get_sector_path(sector)

    if not path or not os.path.exists(path):
        return []

    return [f for f in os.listdir(path) if f.endswith(".csv")]


def dataset_count(sector):

    return len(list_datasets(sector))


def load_dataset(sector, filename):

    path = os.path.join(get_sector_path(sector), filename)

    df = pd.read_csv(path)

    # 🔧 Fix JSON serialization issue
    df = df.replace([float("inf"), float("-inf")], None)
    df = df.where(pd.notnull(df), None)

    return df


def dataset_preview(df):

    preview = df.head(10)

    return preview.to_dict(orient="records")


def dataset_summary(df):

    return {
        "rows": int(len(df)),
        "columns": list(df.columns)
    }