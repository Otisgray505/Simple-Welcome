# Simple Welcome

A simple frontend project that fetches user data from a database and displays user information including:

- User names
- Estimated time until birthday
- Latest drinks

## Getting Started

### Running the Project

Open `frontend/index.html` directly in your browser, or serve it using a local HTTP server:

```bash
# Using npx (Node.js)
npx serve frontend

# Using Python
python -m http.server 8000 -d frontend
```

Then visit `http://localhost:8000` (or the port shown).

## Project Structure

```
Simple-Welcome/
├── frontend/
│   ├── index.html    # Main HTML file
│   ├── style.css    # Stylesheet
│   └── index.js     # JavaScript (data fetching and display)
└── README.md        # This file
```

## Technology

- Plain HTML5
- CSS3
- JavaScript
- Node.js
- PostgreSQL
