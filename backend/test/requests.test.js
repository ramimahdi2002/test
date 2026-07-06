'use strict';

const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { createApp } = require('../src/app');
const { createDb } = require('../src/db');
const { dbConfig } = require('../src/config');

// Run against a dedicated test database so dev data is never touched.
const config = { ...dbConfig(), database: process.env.TEST_DB_NAME || 'client_requests_test' };

let db;
let app;

before(async () => {
  db = await createDb(config);
  app = createApp(db);
});

beforeEach(async () => {
  await db.query('TRUNCATE TABLE requests');
});

after(async () => {
  if (db) await db.end();
});

test('POST /requests creates a request defaulting to status "New"', async () => {
  const res = await request(app)
    .post('/requests')
    .send({ title: 'Broken login', description: 'Users cannot sign in' });

  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Broken login');
  assert.equal(res.body.description, 'Users cannot sign in');
  assert.equal(res.body.status, 'New');
  assert.ok(res.body.id);
  assert.ok(res.body.createdAt);
});

test('POST /requests rejects a missing title with 400', async () => {
  const res = await request(app).post('/requests').send({ description: 'no title here' });

  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});

test('GET /requests lists all created requests', async () => {
  await request(app).post('/requests').send({ title: 'First' });
  await request(app).post('/requests').send({ title: 'Second' });

  const res = await request(app).get('/requests');

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 2);
  const titles = res.body.map((r) => r.title);
  assert.ok(titles.includes('First'));
  assert.ok(titles.includes('Second'));
});

test('GET /requests returns an empty array when there are none', async () => {
  const res = await request(app).get('/requests');

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
});

test('PATCH /requests/:id/status advances New -> In Progress -> Done', async () => {
  const created = await request(app).post('/requests').send({ title: 'Advance me' });
  const { id } = created.body;

  const first = await request(app).patch(`/requests/${id}/status`);
  assert.equal(first.status, 200);
  assert.equal(first.body.status, 'In Progress');

  const second = await request(app).patch(`/requests/${id}/status`);
  assert.equal(second.status, 200);
  assert.equal(second.body.status, 'Done');
});

test('PATCH /requests/:id/status rejects advancing a "Done" request with 409', async () => {
  const created = await request(app).post('/requests').send({ title: 'Already done' });
  const { id } = created.body;
  await request(app).patch(`/requests/${id}/status`); // -> In Progress
  await request(app).patch(`/requests/${id}/status`); // -> Done

  const res = await request(app).patch(`/requests/${id}/status`);

  assert.equal(res.status, 409);
  assert.ok(res.body.error);
});

test('PATCH /requests/:id/status returns 404 for an unknown id', async () => {
  const res = await request(app).patch('/requests/9999/status');

  assert.equal(res.status, 404);
  assert.ok(res.body.error);
});
