// db.js
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "products.db"));

// Create products table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE,
    name TEXT,
    brand TEXT,
    color TEXT,
    size TEXT,
    mrp REAL,
    price REAL,
    quantity INTEGER
  )
`).run();

module.exports = db;
