# Onii-Chan Cafe Resto (COMP016 Lab 3)

## Run with Docker
    docker compose up --build -d
Open http://localhost:8080  (stop with `docker compose down`)

Or without compose:
    docker build -t onii-chan-cafe .
    docker run -d -p 8080:80 --name onii-chan-cafe onii-chan-cafe

## Files
- index.html  Home page
- menu.html   Menu page
- style.css   Styles (:root branding variables, Flexbox, Grid, responsive)
- script.js   All JavaScript (external only)

## JS events used
onclick, onmouseover, onmouseout, onchange, oninput

## Photos
Photos and the logo live in images/. Replace any JPG with the same file name and rebuild (`docker compose up --build -d`).
