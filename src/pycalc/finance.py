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


def compound_interest(
    principal: float,
    rate_percent: float,
    time_years: float,
    compounds_per_year: int = 12,
) -> dict[str, float]:
    if principal < 0 or rate_percent < 0 or time_years < 0:
        raise ValueError("Principal, rate, and time must be non-negative")
    if compounds_per_year <= 0:
        raise ValueError("Compounds per year must be positive")

    rate_decimal = rate_percent / 100.0
    total = principal * (1 + rate_decimal / compounds_per_year) ** (compounds_per_year * time_years)
    interest = total - principal
    return {
        "principal": float(principal),
        "interest": round(float(interest), 10),
        "total": round(float(total), 10),
        "compounds_per_year": float(compounds_per_year),
    }


def loan_payment(principal: float, annual_rate_percent: float, years: float) -> dict[str, float]:
    if principal < 0 or annual_rate_percent < 0 or years <= 0:
        raise ValueError("Principal and rate must be non-negative, and years must be positive")

    total_payments = int(round(years * 12))
    if total_payments <= 0:
        raise ValueError("Years must result in at least one payment")

    monthly_rate = annual_rate_percent / 100.0 / 12.0
    if monthly_rate == 0:
        monthly_payment = principal / total_payments
    else:
        factor = (1 + monthly_rate) ** total_payments
        monthly_payment = principal * (monthly_rate * factor) / (factor - 1)

    total_paid = monthly_payment * total_payments
    total_interest = total_paid - principal
    return {
        "principal": float(principal),
        "monthly_payment": round(float(monthly_payment), 10),
        "total_paid": round(float(total_paid), 10),
        "total_interest": round(float(total_interest), 10),
        "payments": float(total_payments),
    }
