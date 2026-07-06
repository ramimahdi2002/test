'use strict';

const mysql = require('mysql2/promise');

/**
 * Create a MySQL connection pool, creating the database and table if needed.
 *
 * @param {{host:string, port:number, user:string, password:string, database:string}} config
 * @returns {Promise<import('mysql2/promise').Pool>}
 */
async function createDb(config) {
  const { host, port, user, password, database } = config;

  // Ensure the database exists (connect without selecting one first).
  const bootstrap = await mysql.createConnection({ host, port, user, password });
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await bootstrap.end();

  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS requests (
      id          INT          NOT NULL AUTO_INCREMENT,
      title       VARCHAR(255) NOT NULL,
      description TEXT         NOT NULL,
      status      VARCHAR(20)  NOT NULL DEFAULT 'New',
      createdAt   VARCHAR(30)  NOT NULL,
      PRIMARY KEY (id)
    )
  `);

  return pool;
}

module.exports = { createDb };
