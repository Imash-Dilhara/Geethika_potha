const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'geethika_potha',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
});

db.connect((e) => {
  if (e) {
    console.error('Error connecting to database:', e);
    return;
  }
  console.log('Connected with Database successfully');
});

module.exports = db;