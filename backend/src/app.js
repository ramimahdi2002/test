'use strict';

const express = require('express');
const cors = require('cors');

/** Ordered status lifecycle. A request advances one step at a time. */
const STATUSES = ['New', 'In Progress', 'Done'];

/** Return the status that follows `current`, or null if there is none. */
function nextStatus(current) {
  const idx = STATUSES.indexOf(current);
  if (idx === -1 || idx === STATUSES.length - 1) return null;
  return STATUSES[idx + 1];
}

/**
 * Build the Express app around a given MySQL connection pool.
 *
 * @param {import('mysql2/promise').Pool} db
 * @returns {import('express').Express}
 */
function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Create a request (defaults to status "New").
  app.post('/requests', async (req, res, next) => {
    try {
      const { title, description } = req.body ?? {};

      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'title is required and must be a non-empty string' });
      }
      if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({ error: 'description must be a string' });
      }

      const createdAt = new Date().toISOString();
      const [result] = await db.execute(
        'INSERT INTO requests (title, description, status, createdAt) VALUES (?, ?, ?, ?)',
        [title.trim(), description ?? '', 'New', createdAt]
      );
      const [rows] = await db.execute('SELECT * FROM requests WHERE id = ?', [result.insertId]);

      return res.status(201).json(rows[0]);
    } catch (err) {
      return next(err);
    }
  });

  // List all requests, newest first.
  app.get('/requests', async (_req, res, next) => {
    try {
      const [rows] = await db.query('SELECT * FROM requests ORDER BY createdAt DESC, id DESC');
      return res.json(rows);
    } catch (err) {
      return next(err);
    }
  });

  // Advance a request's status one step (New -> In Progress -> Done).
  app.patch('/requests/:id/status', async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'id must be a positive integer' });
      }

      const [rows] = await db.execute('SELECT * FROM requests WHERE id = ?', [id]);
      const existing = rows[0];
      if (!existing) {
        return res.status(404).json({ error: 'request not found' });
      }

      const advanced = nextStatus(existing.status);
      if (!advanced) {
        return res.status(409).json({ error: `request is already "${existing.status}" and cannot advance` });
      }

      await db.execute('UPDATE requests SET status = ? WHERE id = ?', [advanced, id]);
      const [updated] = await db.execute('SELECT * FROM requests WHERE id = ?', [id]);

      return res.json(updated[0]);
    } catch (err) {
      return next(err);
    }
  });

  // Fallback error handler.
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}

module.exports = { createApp, STATUSES, nextStatus };
