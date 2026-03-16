import pandas as pd


def generate_charts(df):

    numeric_cols = df.select_dtypes(include="number").columns

    charts = []

    if len(numeric_cols) > 0:

        col = numeric_cols[0]

        charts.append({
            "type": "bar",
            "x": df.index[:10].tolist(),
            "y": df[col].head(10).tolist(),
            "label": col
        })

        charts.append({
            "type": "line",
            "x": df.index[:10].tolist(),
            "y": df[col].head(10).tolist(),
            "label": col
        })

    return charts