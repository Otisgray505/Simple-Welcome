# Simple Welcome

A Next.js website that fetches user data from a database and displays:
- User names
- Estimated time until birthday
- Latest drinks

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Database (Dev)**: SQLite (better-sqlite3)
- **Database (Prod)**: PostgreSQL (pg)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Database Setup

For development (SQLite):
```bash
npm run db:setup
npm run db:seed
```

For production (PostgreSQL), set environment variables:
```bash
# .env file
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/simple_welcome
PG_SSL=true

# Then run setup
npm run db:setup
npm run db:seed
```

### Running the App

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Simple-Welcome/
├── pages/
│   ├── api/
│   │   └── users.js       # API endpoint for users
│   ├── _app.js            # App wrapper
│   └── index.js           # Main page
├── styles/
│   └── globals.css        # Global styles
├── lib/
│   └── db.js              # Database configuration
├── scripts/
│   ├── setup-db.js        # Database setup
│   └── seed-db.js         # Seed sample data
├── data/                  # SQLite database (dev)
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Initialize database
- `npm run db:seed` - Seed sample data
