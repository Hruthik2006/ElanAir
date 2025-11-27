const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'hcp',
  password: '2006hcp@37cp!',
  database: 'elan_air'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;

// D:\ElanAir\backend> node sever.js