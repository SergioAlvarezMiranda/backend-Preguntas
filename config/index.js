const path = require('path');
const dotenv = require('dotenv');

// Carga variables de entorno desde .env si existe
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const getNumber = (value, fallback) => {
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? fallback : n;
};

const config = {
    port: getNumber(process.env.PORT, 3000),
    env: process.env.NODE_ENV || 'development',
    db: {
        host: process.env.PGHOST || 'localhost',
        port: getNumber(process.env.PGPORT, 5432),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'admin',
        database: process.env.PGDATABASE || 'bdpreguntas'
    }
};

module.exports = config;
