# Calculator

This repository contains two interfaces for a basic calculator:

- A C++ console application located in `main.cpp`.
- A Streamlit web application in `streamlit_app.py` that can be deployed to Streamlit Community Cloud.

## Running the console calculator

```bash
cmake -S . -B build
cmake --build build
./build/main
```

## Running the Streamlit app locally

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Deploying to Streamlit Community Cloud

1. Push this repository to GitHub.
2. Create a new Streamlit app and point it at the repository.
3. Set `streamlit_app.py` as the entry point file.

Once deployed, the page presents buttons for addition, subtraction, multiplication, division, and session controls so you can mirror the behaviour of the console calculator in your browser.
