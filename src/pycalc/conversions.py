from __future__ import annotations


_UNIT_TO_BASE = {
    "mm": ("length", 0.001),
    "cm": ("length", 0.01),
    "m": ("length", 1.0),
    "km": ("length", 1000.0),
    "inch": ("length", 0.0254),
    "ft": ("length", 0.3048),
    "yd": ("length", 0.9144),
    "mi": ("length", 1609.344),
    "mg": ("mass", 0.001),
    "g": ("mass", 1.0),
    "kg": ("mass", 1000.0),
    "lb": ("mass", 453.59237),
    "oz": ("mass", 28.349523125),
    "ms": ("time", 0.001),
    "s": ("time", 1.0),
    "min": ("time", 60.0),
    "hr": ("time", 3600.0),
    "day": ("time", 86400.0),
}


def convert_unit(value: float, from_unit: str, to_unit: str) -> float:
    source = from_unit.lower()
    target = to_unit.lower()

    if source in {"c", "f", "k"} or target in {"c", "f", "k"}:
        return _convert_temperature(value, source, target)

    if source not in _UNIT_TO_BASE or target not in _UNIT_TO_BASE:
        raise ValueError("Unsupported unit")

    source_kind, source_factor = _UNIT_TO_BASE[source]
    target_kind, target_factor = _UNIT_TO_BASE[target]
    if source_kind != target_kind:
        raise ValueError("Cannot convert across unit families")

    base_value = value * source_factor
    return base_value / target_factor


def _convert_temperature(value: float, from_unit: str, to_unit: str) -> float:
    if from_unit not in {"c", "f", "k"} or to_unit not in {"c", "f", "k"}:
        raise ValueError("Unsupported temperature unit")

    if from_unit == "c":
        celsius = value
    elif from_unit == "f":
        celsius = (value - 32.0) * 5.0 / 9.0
    else:
        celsius = value - 273.15

    if to_unit == "c":
        return celsius
    if to_unit == "f":
        return celsius * 9.0 / 5.0 + 32.0
    return celsius + 273.15
