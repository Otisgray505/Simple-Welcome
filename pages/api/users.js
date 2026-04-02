const { getDb, initDatabase } = require('../../lib/db');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initDatabase();
    const db = getDb();
    
    let users;
    if (db.type === 'sqlite') {
      const result = db.db.exec('SELECT * FROM users');
      if (result.length > 0) {
        const columns = result[0].columns;
        users = result[0].values.map(row => {
          const obj = {};
          columns.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        });
      } else {
        users = [];
      }
    } else {
      const result = await db.pool.query('SELECT * FROM users');
      users = result.rows;
    }

    const processedUsers = users.map(user => ({
      ...user,
      birthday: user.birthday instanceof Date 
        ? user.birthday.toISOString().split('T')[0]
        : String(user.birthday).split('T')[0]
    }));

    res.status(200).json(processedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
