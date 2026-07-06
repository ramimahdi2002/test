'use strict';

const { createApp } = require('./app');
const { createDb } = require('./db');
const { dbConfig } = require('./config');

const PORT = process.env.PORT || 4000;

async function main() {
  const db = await createDb(dbConfig());
  const app = createApp(db);

  app.listen(PORT, () => {
    console.log(`Client Requests API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
