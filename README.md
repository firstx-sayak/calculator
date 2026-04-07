# Calculator

This repository ships two ways to interact with the calculator engine:

- **C++ console app** (`main.cpp`) for terminal-based calculations.
- **React single-page app** (`frontend/`) built with Vite that recreates a full calculator keypad for the browser.

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
- Unary tools for square root, squaring, reciprocal, and backspace
- A running expression preview and recent-calculation history panel
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
