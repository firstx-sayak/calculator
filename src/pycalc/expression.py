from __future__ import annotations

import ast
import math
import operator
from typing import Any


_BINARY_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}

_UNARY_OPERATORS = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}

_CONSTANTS = {
    "pi": math.pi,
    "e": math.e,
    "tau": math.tau,
}

_FUNCTIONS = {
    "abs": abs,
    "ceil": math.ceil,
    "comb": math.comb,
    "cos": math.cos,
    "degrees": math.degrees,
    "exp": math.exp,
    "factorial": math.factorial,
    "floor": math.floor,
    "gcd": math.gcd,
    "lcm": math.lcm,
    "log": math.log,
    "log10": math.log10,
    "radians": math.radians,
    "sin": math.sin,
    "sqrt": math.sqrt,
    "tan": math.tan,
}


class ExpressionError(ValueError):
    pass


def evaluate_expression(expression: str) -> float:
    try:
        parsed = ast.parse(expression, mode="eval")
    except SyntaxError as exc:
        raise ExpressionError("Invalid expression syntax") from exc

    result = _evaluate_node(parsed.body)
    if isinstance(result, bool):
        raise ExpressionError("Boolean results are not supported")
    return float(result)


def _evaluate_node(node: ast.AST) -> Any:
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value

    if isinstance(node, ast.BinOp):
        operator_fn = _BINARY_OPERATORS.get(type(node.op))
        if operator_fn is None:
            raise ExpressionError("Unsupported binary operator")
        left = _evaluate_node(node.left)
        right = _evaluate_node(node.right)
        try:
            return operator_fn(left, right)
        except ZeroDivisionError as exc:
            raise ExpressionError("Division by zero") from exc

    if isinstance(node, ast.UnaryOp):
        operator_fn = _UNARY_OPERATORS.get(type(node.op))
        if operator_fn is None:
            raise ExpressionError("Unsupported unary operator")
        return operator_fn(_evaluate_node(node.operand))

    if isinstance(node, ast.Name):
        if node.id not in _CONSTANTS:
            raise ExpressionError(f"Unknown identifier: {node.id}")
        return _CONSTANTS[node.id]

    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
        function_name = node.func.id
        function = _FUNCTIONS.get(function_name)
        if function is None:
            raise ExpressionError(f"Unknown function: {function_name}")
        if node.keywords:
            raise ExpressionError("Keyword arguments are not supported")
        arguments = [_evaluate_node(arg) for arg in node.args]
        try:
            return function(*arguments)
        except (TypeError, ValueError) as exc:
            raise ExpressionError(str(exc)) from exc

    raise ExpressionError("Unsupported expression")
