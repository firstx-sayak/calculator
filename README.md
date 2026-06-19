# Calculator

This repository ships two ways to interact with the calculator engine:

- **C++ console app** (`main.cpp`) for terminal-based calculations.
- **React single-page app** (`frontend/`) built with Vite that recreates a full calculator keypad for the browser.
- **Python calculator toolkit** (`src/pycalc/`) that adds a separate modular codebase without replacing the existing C++ app.

## Running the console calculator

```bash
cmake -S . -B build
cmake --build build
./build/main
```

## Running the React frontend locally

```bash
cd frontend
npm install
npm run dev
```

The development server prints a local URL (typically `http://localhost:5173`) where you can interact with the calculator. The browser app now includes:

- Core arithmetic with chained operations
- Memory controls (`MC`, `MR`, `M+`, `M-`)
- Scientific tools for square root, squaring, reciprocal, factorial, trigonometry, logarithms, and backspace
- Angle-mode switching (`Deg` / `Rad`) and precision-mode switching (`Compact` / `High`)
- Constant injection for `π` and `e`
- A running expression preview, clickable recent-calculation history panel, and session stats
- Keyboard shortcuts for digits, operators, `Enter`, `Backspace`, `Esc`, and `Ctrl/Cmd + L`

### Production build

To create a production bundle ready for static hosting services:

```bash
cd frontend
npm install
npm run build
```

The optimized assets are emitted to `frontend/dist/`. You can preview the built site locally with:

```bash
npm run preview
```

Deploy those static files to any host (such as Vercel, Netlify, or GitHub Pages) to serve the calculator web app.

## Running the Python calculator toolkit

The new Python code is additive and lives under `src/pycalc/`. It does not replace `main.cpp`.

Available features:

- Safe expression evaluation with constants and common math functions
- Scientific helpers like `sqrt`, `power`, `sin`, `cos`, `tan`, `ln`, and `log10`
- Statistics summaries for numeric lists
- Length and temperature conversion
- Simple-interest calculations

Examples:

```bash
python3 run_pycalc.py eval "sqrt(144) + log10(100)"
python3 run_pycalc.py scientific power 2 8
python3 run_pycalc.py stats 10 20 30 40
python3 run_pycalc.py convert 98.6 f c
python3 run_pycalc.py interest 10000 6.5 3
```

## Running Python tests

```bash
python3 -m unittest discover -s tests -p "test_*.py"
```
