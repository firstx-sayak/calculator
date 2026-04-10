from __future__ import annotations


def simple_interest(principal: float, rate_percent: float, time_years: float) -> dict[str, float]:
    if principal < 0 or rate_percent < 0 or time_years < 0:
        raise ValueError("Principal, rate, and time must be non-negative")

    interest = round(principal * (rate_percent / 100.0) * time_years, 10)
    total = round(principal + interest, 10)
    return {
        "principal": float(principal),
        "interest": float(interest),
        "total": float(total),
    }
