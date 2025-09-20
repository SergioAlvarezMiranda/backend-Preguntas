//! npm install pg esto permite la  conexión a postgresql

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dbPregunta",
  password: "",
  port: 5433
});

async function test() {
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows);
}
test();
module.exports = pool;
