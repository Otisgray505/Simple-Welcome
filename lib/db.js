const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

let sqliteDb = null;
let SQL = null;
let pgPool = null;
let dbInitialized = false;

async function getSqliteDb() {
  if (!sqliteDb) {
    const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'simple-welcome.db');
    const dbDir = path.dirname(dbPath);
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    SQL = await initSqlJs();
    
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      sqliteDb = new SQL.Database(fileBuffer);
    } else {
      sqliteDb = new SQL.Database();
    }
  }
  return sqliteDb;
}

function saveSqliteDb() {
  if (sqliteDb) {
    const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'data', 'simple-welcome.db');
    const data = sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function getPgPool() {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
  }
  return pgPool;
}

function getDb() {
  if (isProduction()) {
    return { type: 'pg', pool: getPgPool() };
  }
  return { type: 'sqlite', db: sqliteDb };
}

async function initDatabase() {
  if (dbInitialized && sqliteDb) {
    return getDb();
  }
  
  if (isProduction()) {
    const pool = getPgPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        birthday DATE NOT NULL,
        latest_drink TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    dbInitialized = true;
    return { type: 'pg', pool };
  } else {
    const sqlite = await getSqliteDb();
    sqlite.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birthday TEXT NOT NULL,
        latest_drink TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    saveSqliteDb();
    dbInitialized = true;
    return { type: 'sqlite', db: sqlite };
  }
}

function closeDb() {
  if (sqliteDb) {
    saveSqliteDb();
    sqliteDb.close();
    sqliteDb = null;
  }
  if (pgPool) {
    pgPool.end();
    pgPool = null;
  }
  dbInitialized = false;
}

module.exports = {
  getDb,
  initDatabase,
  closeDb,
  isProduction,
  saveSqliteDb,
};
