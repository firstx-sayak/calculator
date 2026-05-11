from __future__ import annotations

import pathlib
import sys
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from pycalc import (
    compound_interest,
    convert_unit,
    evaluate_expression,
    loan_payment,
    scientific_operation,
    simple_interest,
    summarize_numbers,
)


class PyCalcTests(unittest.TestCase):
    def test_expression_supports_constants_and_functions(self) -> None:
        result = evaluate_expression("sqrt(81) + sin(pi / 2) + log10(1000)")
        self.assertAlmostEqual(result, 13.0)

    def test_expression_supports_more_advanced_functions(self) -> None:
        result = evaluate_expression("round(log2(8) + atan2(4, 3), 4)")
        self.assertAlmostEqual(result, 3.9273, places=4)

    def test_expression_rejects_unsafe_names(self) -> None:
        with self.assertRaises(ValueError):
            evaluate_expression("__import__('os').system('echo no')")

    def test_scientific_operation_power(self) -> None:
        self.assertEqual(scientific_operation("power", 2, 5), 32.0)

    def test_statistics_summary(self) -> None:
        summary = summarize_numbers([2, 4, 4, 4, 5, 5, 7, 9])
        self.assertAlmostEqual(summary["mean"], 5.0)
        self.assertAlmostEqual(summary["median"], 4.5)
        self.assertAlmostEqual(summary["stdev"], 2.0)
        self.assertAlmostEqual(summary["range"], 7.0)
        self.assertAlmostEqual(summary["q1"], 4.0)
        self.assertAlmostEqual(summary["q3"], 5.5)
        self.assertAlmostEqual(summary["iqr"], 1.5)

    def test_unit_conversion(self) -> None:
        self.assertAlmostEqual(convert_unit(1, "km", "m"), 1000.0)
        self.assertAlmostEqual(convert_unit(32, "f", "c"), 0.0)
        self.assertAlmostEqual(convert_unit(10, "lb", "kg"), 4.5359237)
        self.assertAlmostEqual(convert_unit(2, "day", "hr"), 48.0)

    def test_simple_interest(self) -> None:
        result = simple_interest(5000, 7, 2)
        self.assertEqual(
            result,
            {
                "principal": 5000.0,
                "interest": 700.0,
                "total": 5700.0,
            },
        )

    def test_compound_interest(self) -> None:
        result = compound_interest(1000, 12, 1, 12)
        self.assertAlmostEqual(result["interest"], 126.82503013197, places=6)
        self.assertAlmostEqual(result["total"], 1126.82503013197, places=6)

    def test_loan_payment(self) -> None:
        result = loan_payment(250000, 6, 30)
        self.assertAlmostEqual(result["monthly_payment"], 1498.876313, places=3)
        self.assertAlmostEqual(result["payments"], 360.0)


if __name__ == "__main__":
    unittest.main()
