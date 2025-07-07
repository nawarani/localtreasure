// PG database client/connection setup
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

module.exports = db;
