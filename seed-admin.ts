import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const hash = await bcrypt.hash('admin123', 10);

await pool.query(
  'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
  ['admin', hash, 1, hash]
);

console.log('✅ User admin berhasil dibuat! Username: admin | Password: admin123');
await pool.end();
