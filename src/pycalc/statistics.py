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

    return summary
