const { Pool } = require("pg");

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bdpreguntas',
  user: 'postgres',
  password: 'admin'
});

// Compatibilidad: reexportamos el pool central desde db/index.js
const db = require('./db');

// Exporta la interfaz antigua (pool) y también una función query
module.exports = db.pool || db;