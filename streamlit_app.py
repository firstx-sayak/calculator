"""Streamlit interface for the calculator application.

This page mirrors the behaviour of the original console-based calculator
while providing a friendly web interface that can be deployed to Streamlit
Community Cloud.
"""

from __future__ import annotations

import operator
from typing import Callable

import streamlit as st


Number = float


def format_result(value: Number) -> str:
    """Return a human readable representation of a number."""

    if value == int(value):
        return f"{int(value)}"
    return f"{value:.6g}"


def update_result(fn: Callable[[Number, Number], Number], operand: Number, symbol: str) -> None:
    """Apply ``fn`` to the running total and ``operand`` and store the result."""

    current = st.session_state.current_total
    try:
        result = fn(current, operand)
    except ZeroDivisionError:
        st.error("Cannot divide by zero.")
        return

    st.session_state.current_total = result
    st.session_state.history.insert(0, f"{format_result(current)} {symbol} {format_result(operand)} = {format_result(result)}")


def reset_session() -> None:
    """Clear the calculator session state."""

    st.session_state.current_total = None
    st.session_state.history = []


def ensure_state() -> None:
    """Initialise values stored in ``st.session_state`` if necessary."""

    if "current_total" not in st.session_state:
        st.session_state.current_total = None
    if "history" not in st.session_state:
        st.session_state.history = []


def main() -> None:
    """Render the Streamlit calculator page."""

    st.set_page_config(page_title="Calculator", page_icon="🧮", layout="centered")
    ensure_state()

    st.title("🧮 Calculator")
    st.caption("Perform chained arithmetic operations in your browser.")

    if st.session_state.current_total is None:
        st.subheader("Get started")
        initial_value = st.number_input(
            "Choose an initial number to begin your calculation:",
            key="initial_input",
            value=0.0,
            format="%.6f",
        )
        if st.button("Start calculator", type="primary"):
            st.session_state.current_total = float(initial_value)
            st.session_state.history = [
                f"Start with {format_result(st.session_state.current_total)}",
            ]
            st.experimental_rerun()
        st.stop()

    st.subheader("Current total")
    st.metric(label="Running result", value=format_result(st.session_state.current_total))

    st.divider()
    st.subheader("Apply an operation")

    operand = st.number_input(
        "Enter the next number:",
        key="operand_input",
        value=0.0,
        format="%.6f",
    )

    operations: dict[str, tuple[str, Callable[[Number, Number], Number]]] = {
        "Add (+)": ("+", operator.add),
        "Subtract (−)": ("-", operator.sub),
        "Multiply (×)": ("×", operator.mul),
        "Divide (÷)": ("÷", operator.truediv),
    }

    cols = st.columns(len(operations))
    for (label, (symbol, fn)), column in zip(operations.items(), cols):
        if column.button(label):
            update_result(fn, float(operand), symbol)
            st.experimental_rerun()

    st.divider()

    control_cols = st.columns(2)
    with control_cols[0]:
        if st.button("Reset calculator", key="reset"):
            reset_session()
            st.experimental_rerun()
    with control_cols[1]:
        if st.button("End session", key="end"):
            reset_session()
            st.info("Session ended. Start again whenever you're ready.")
            st.stop()

    st.divider()
    st.subheader("History")
    if st.session_state.history:
        for entry in st.session_state.history:
            st.write(entry)
    else:
        st.write("No operations yet. Use the buttons above to get started.")


if __name__ == "__main__":
    main()

