require('dotenv').config();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const { initDatabase, closeDb, isProduction } = require('../lib/db');

console.log('Setting up database...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Using:', isProduction() ? 'PostgreSQL' : 'SQLite');

async function setup() {
  try {
    const db = await initDatabase();
    console.log('Database initialized successfully!');

    if (db.type === 'sqlite') {
      console.log('SQLite database ready at: ./data/simple-welcome.db');
    } else {
      console.log('PostgreSQL database ready');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    closeDb();
    process.exit(1);
  } finally {
    closeDb();
  }
}

setup();
