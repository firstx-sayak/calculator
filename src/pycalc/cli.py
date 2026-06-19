from __future__ import annotations

import argparse
import json

from .conversions import convert_unit
from .expression import evaluate_expression
from .finance import compound_interest, loan_payment, simple_interest
from .scientific import scientific_operation
from .statistics import summarize_numbers


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Python calculator toolkit")
    subparsers = parser.add_subparsers(dest="command", required=True)

    eval_parser = subparsers.add_parser("eval", help="Evaluate a safe math expression")
    eval_parser.add_argument("expression")

    sci_parser = subparsers.add_parser("scientific", help="Run a scientific operation")
    sci_parser.add_argument("name")
    sci_parser.add_argument("value", type=float)
    sci_parser.add_argument("second_value", nargs="?", type=float)

    stats_parser = subparsers.add_parser("stats", help="Summarize a list of numbers")
    stats_parser.add_argument("values", nargs="+", type=float)

    convert_parser = subparsers.add_parser("convert", help="Convert between supported units")
    convert_parser.add_argument("value", type=float)
    convert_parser.add_argument("from_unit")
    convert_parser.add_argument("to_unit")

    finance_parser = subparsers.add_parser("interest", help="Calculate simple interest")
    finance_parser.add_argument("principal", type=float)
    finance_parser.add_argument("rate_percent", type=float)
    finance_parser.add_argument("time_years", type=float)

    compound_parser = subparsers.add_parser("compound", help="Calculate compound interest")
    compound_parser.add_argument("principal", type=float)
    compound_parser.add_argument("rate_percent", type=float)
    compound_parser.add_argument("time_years", type=float)
    compound_parser.add_argument("--compounds-per-year", type=int, default=12)

    loan_parser = subparsers.add_parser("loan", help="Estimate a fixed-rate monthly loan payment")
    loan_parser.add_argument("principal", type=float)
    loan_parser.add_argument("annual_rate_percent", type=float)
    loan_parser.add_argument("years", type=float)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "eval":
        print(evaluate_expression(args.expression))
        return

    if args.command == "scientific":
        print(scientific_operation(args.name, args.value, args.second_value))
        return

    if args.command == "stats":
        print(json.dumps(summarize_numbers(args.values), indent=2, sort_keys=True))
        return

    if args.command == "convert":
        print(convert_unit(args.value, args.from_unit, args.to_unit))
        return

    if args.command == "interest":
        print(json.dumps(simple_interest(args.principal, args.rate_percent, args.time_years), indent=2, sort_keys=True))
        return

    if args.command == "compound":
        print(
            json.dumps(
                compound_interest(
                    args.principal,
                    args.rate_percent,
                    args.time_years,
                    args.compounds_per_year,
                ),
                indent=2,
                sort_keys=True,
            )
        )
        return

    if args.command == "loan":
        print(json.dumps(loan_payment(args.principal, args.annual_rate_percent, args.years), indent=2, sort_keys=True))
        return

    parser.error("Unknown command")


if __name__ == "__main__":
    main()
