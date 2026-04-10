from __future__ import annotations

import math


def scientific_operation(name: str, value: float, second_value: float | None = None) -> float:
    operation = name.lower()

    unary_operations = {
        "sqrt": math.sqrt,
        "square": lambda x: x * x,
        "cube": lambda x: x * x * x,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log10": math.log10,
        "ln": math.log,
        "exp": math.exp,
    }

    if operation in unary_operations:
        return float(unary_operations[operation](value))

    if second_value is None:
        raise ValueError(f"Operation '{name}' requires a second value")

    binary_operations = {
        "power": math.pow,
        "hypot": math.hypot,
    }

    if operation not in binary_operations:
        raise ValueError(f"Unknown scientific operation: {name}")

    return float(binary_operations[operation](value, second_value))
