from __future__ import annotations

import math


def scientific_operation(name: str, value: float, second_value: float | None = None) -> float:
    operation = name.lower()

    unary_operations = {
        "abs": abs,
        "acos": math.acos,
        "asin": math.asin,
        "atan": math.atan,
        "cbrt": lambda x: math.copysign(abs(x) ** (1.0 / 3.0), x),
        "ceil": math.ceil,
        "sqrt": math.sqrt,
        "square": lambda x: x * x,
        "cube": lambda x: x * x * x,
        "degrees": math.degrees,
        "floor": math.floor,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log2": math.log2,
        "log10": math.log10,
        "ln": math.log,
        "exp": math.exp,
        "radians": math.radians,
    }

    if operation in unary_operations:
        return float(unary_operations[operation](value))

    if second_value is None:
        raise ValueError(f"Operation '{name}' requires a second value")

    binary_operations = {
        "atan2": math.atan2,
        "mod": math.fmod,
        "power": math.pow,
        "hypot": math.hypot,
    }

    if operation not in binary_operations:
        raise ValueError(f"Unknown scientific operation: {name}")

    return float(binary_operations[operation](value, second_value))
