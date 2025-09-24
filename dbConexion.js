const { Pool } = require("pg");

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'dbpregunta',
    user: 'postgres',
    password: '123'  // ← Ahora esta contraseña está correcta
});

pool.connect()
  .then(client => {
    console.log('✅ Conexión exitosa a PostgreSQL');
    client.release();
  })
  .catch(err => console.error('❌ Error de conexión', err.stack));

module.exports = pool;