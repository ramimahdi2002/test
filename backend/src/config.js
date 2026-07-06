'use strict';

/** Read MySQL connection settings from the environment (see .env.example). */
function dbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'client_requests',
  };
}

module.exports = { dbConfig };
