require('dotenv').config();
const { initDatabase, getDb, saveSqliteDb, closeDb, isProduction } = require('../lib/db');

const sampleUsers = [
  { name: 'Alice Johnson', birthday: '1995-06-15', latest_drink: 'Iced Latte' },
  { name: 'Bob Smith', birthday: '1988-11-22', latest_drink: 'Green Tea' },
  { name: 'Carol Williams', birthday: '1992-03-08', latest_drink: 'Cappuccino' },
  { name: 'David Brown', birthday: '1990-09-30', latest_drink: 'Espresso' },
  { name: 'Emma Davis', birthday: '1998-12-14', latest_drink: 'Hot Chocolate' },
  { name: 'Frank Miller', birthday: '1985-07-25', latest_drink: 'Black Coffee' },
  { name: 'Grace Wilson', birthday: '1993-04-18', latest_drink: 'Matcha Latte' },
  { name: 'Henry Taylor', birthday: '1991-10-05', latest_drink: 'Americano' },
];

async function seedDatabase() {
  console.log('Seeding database...');
  
  await initDatabase();
  const db = getDb();
  
  let count = 0;
  if (db.type === 'sqlite') {
    const result = db.db.exec('SELECT COUNT(*) as count FROM users');
    count = result.length > 0 ? result[0].values[0][0] : 0;
  } else {
    const result = await db.pool.query('SELECT COUNT(*) FROM users');
    count = parseInt(result.rows[0].count);
  }
  
  if (count > 0) {
    console.log(`Database already has ${count} users. Skipping seed.`);
    closeDb();
    return;
  }
  
  if (db.type === 'sqlite') {
    for (const user of sampleUsers) {
      db.db.run(
        'INSERT INTO users (name, birthday, latest_drink) VALUES (?, ?, ?)',
        [user.name, user.birthday, user.latest_drink]
      );
    }
    saveSqliteDb();
    console.log(`Inserted ${sampleUsers.length} users into SQLite database`);
  } else {
    for (const user of sampleUsers) {
      await db.pool.query(
        'INSERT INTO users (name, birthday, latest_drink) VALUES ($1, $2, $3)',
        [user.name, user.birthday, user.latest_drink]
      );
    }
    console.log(`Inserted ${sampleUsers.length} users into PostgreSQL database`);
  }
  
  console.log('Seeding completed!');
  closeDb();
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  closeDb();
  process.exit(1);
});
