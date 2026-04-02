# AGENTS.md - Development Guidelines for Simple-Welcome

## Project Overview

A Next.js website that fetches user data from a database and displays:
- User names
- Estimated time until birthday
- Latest drinks

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Database (Dev)**: SQLite (better-sqlite3)
- **Database (Prod)**: PostgreSQL (pg)

## Build / Development Commands

### Installation
```bash
npm install
```

### Running the App
```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
```

### Database Commands
```bash
npm run db:setup     # Initialize database (creates tables)
npm run db:seed      # Seed sample user data
```

### Linting
```bash
npm run lint         # Run ESLint
```

## Code Style Guidelines

### General Principles

- Use functional components with hooks in React
- Keep files modular and focused
- Server-side rendering for initial data fetching

### JavaScript/React Guidelines

- Use `const` by default, `let` when mutation is needed
- Use descriptive variable and function names (camelCase)
- Use ES6+ features (arrow functions, template literals, destructuring)
- Handle errors with try-catch for async operations
- Use `getServerSideProps` for SSR data fetching
- Keep components small and focused

### CSS Guidelines

- Use CSS variables for colors and spacing
- Keep specificity low; avoid deeply nested selectors
- Group related styles together

### Naming Conventions

- **Files**: lowercase with hyphens (`my-script.js`, `main-styles.css`)
- **Components**: PascalCase (`HomePage.js`, `UserCard.js`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: lowercase with hyphens (BEM-style recommended)

### Error Handling

- Always handle promise rejections
- Provide fallback content for failed operations
- Log errors appropriately for debugging

### Database

- Use `lib/db.js` for database operations
- Set `NODE_ENV=production` to use PostgreSQL (defaults to SQLite)
- Use parameterized queries to prevent SQL injection

## Project Structure

```
Simple-Welcome/
├── pages/
│   ├── api/
│   │   └── users.js       # GET /api/users - returns all users
│   ├── _app.js            # App wrapper
│   └── index.js           # Main page with user data
├── styles/
│   └── globals.css        # Global styles (from original React component)
├── lib/
│   └── db.js              # Database config (SQLite + PostgreSQL)
├── scripts/
│   ├── setup-db.js        # Database setup script
│   └── seed-db.js         # Seed sample data (8 users)
├── data/                  # SQLite database location
├── package.json
├── next.config.js
├── .env.example
└── README.md
```

## Environment Variables

```bash
# Development (SQLite - default)
NODE_ENV=development
SQLITE_PATH=./data/simple-welcome.db

# Production (PostgreSQL)
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/simple_welcome
PG_SSL=true
```

## Sample Data

The seed script creates 8 sample users with:
- Name (full name)
- Birthday (date)
- Latest drink (string)
