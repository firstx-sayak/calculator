from __future__ import annotations

import statistics


def summarize_numbers(values: list[float]) -> dict[str, float]:
    if not values:
        raise ValueError("At least one number is required")

    summary = {
        "count": float(len(values)),
        "sum": float(sum(values)),
        "mean": float(statistics.fmean(values)),
        "median": float(statistics.median(values)),
        "min": float(min(values)),
        "max": float(max(values)),
        "range": float(max(values) - min(values)),
    }

    try:
        summary["mode"] = float(statistics.mode(values))
    except statistics.StatisticsError:
        summary["mode"] = float(values[0])

    if len(values) > 1:
        summary["variance"] = float(statistics.pvariance(values))
        summary["stdev"] = float(statistics.pstdev(values))
    else:
        summary["variance"] = 0.0
        summary["stdev"] = 0.0

    quantiles = _inclusive_quartiles(values)
    summary["q1"] = quantiles["q1"]
    summary["q3"] = quantiles["q3"]
    summary["iqr"] = quantiles["q3"] - quantiles["q1"]

    return summary


def _inclusive_quartiles(values: list[float]) -> dict[str, float]:
    ordered = sorted(values)
    if len(ordered) == 1:
        only_value = float(ordered[0])
        return {"q1": only_value, "q3": only_value}

    quartiles = statistics.quantiles(ordered, n=4, method="inclusive")
    return {
        "q1": float(quartiles[0]),
        "q3": float(quartiles[2]),
    }
