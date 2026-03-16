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


import re

def list_datasets(sector):

    path = get_sector_path(sector)

    if not path or not os.path.exists(path):
        return []

    # Only include datasets that follow the expected naming pattern
    # such as "001_...csv" to avoid stray files and versioned/duplicate exports.
    pattern = re.compile(r"^(\d{3})_.*\.csv$")

    files = sorted([f for f in os.listdir(path) if pattern.match(f)])

    # Keep only one file per numeric prefix (e.g., 001_), so we don't return multiple
    # versions of the same dataset with different hash suffixes.
    seen = set()
    filtered = []
    for f in files:
        prefix = pattern.match(f).group(1)
        if prefix not in seen:
            seen.add(prefix)
            filtered.append(f)

    return filtered


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