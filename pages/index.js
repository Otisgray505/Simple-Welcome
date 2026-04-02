import { useState, useEffect } from 'react';

function calculateDaysUntilBirthday(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);
  
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

function formatBirthdayCountdown(days) {
  if (days === 0) return 'Today is their birthday!';
  if (days === 1) return 'Tomorrow';
  if (days <= 30) return `${days} days`;
  if (days <= 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
}

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);

  return (
    <div className="page">
      <nav>
        <div className="nav-logo">Hello·Web</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      <main className="hero">
        <div className="eyebrow">Welcome to the site</div>

        <h1 className="hero-title">
          Hello,<br /><em>Website.</em>
        </h1>

        <p className="hero-sub">
          Built with <strong>Next.js</strong> &amp; <strong>React.js</strong> —
          fast, modern, and ready to grow.
        </p>

        <div className="cta-row">
          <button className="btn-primary">Get Started</button>
          <button className="btn-ghost">Learn More</button>
        </div>

        <div className="pill-row">
          <span className="pill">Next.js</span>
          <span className="pill">React.js</span>
          <span className="pill">Frontend</span>
          <span className="pill">Group 8</span>
        </div>

        {users.length > 0 && (
          <section className="users-section">
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-info">
                    Birthday: <span>{formatBirthdayCountdown(calculateDaysUntilBirthday(user.birthday))}</span>
                  </p>
                  <p className="user-info">
                    Latest Drink: <span>{user.latest_drink}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer>
        <span className="footer-copy">© 2026 Group 8. All rights reserved.</span>
        <span className="footer-built">Built with <span>Next.js</span> &amp; <span>React</span></span>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  let users = [];
  
  try {
    const { getDb, initDatabase } = require('../lib/db');
    await initDatabase();
    const db = getDb();
    
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
      }
    } else {
      const result = await db.pool.query('SELECT * FROM users');
      users = result.rows;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return {
    props: {
      initialUsers: users.map(user => ({
        ...user,
        birthday: user.birthday instanceof Date 
          ? user.birthday.toISOString().split('T')[0]
          : String(user.birthday).split('T')[0]
      }))
    }
  };
}
