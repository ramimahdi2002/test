# Client Requests — Backend

REST API for the Client Requests dashboard. Node.js + Express, backed by
**MySQL** via [mysql2](https://github.com/sidorares/node-mysql2).

## Prerequisites

- Node.js 18+.
- A running MySQL 8 server you can connect to.

The API creates its database and table automatically on startup — you only need
a server and credentials, no manual schema step.

Don't have MySQL handy? Run one with Docker:

```bash
docker run -d --name cr-mysql -e MYSQL_ROOT_PASSWORD=rootpass -p 3306:3306 mysql:8
```

## Configure

Copy `.env.example` to `.env` and adjust to match your server:

| Variable       | Default                 | Description                                   |
| -------------- | ----------------------- | --------------------------------------------- |
| `PORT`         | `4000`                  | Port the API listens on.                      |
| `DB_HOST`      | `localhost`             | MySQL host.                                   |
| `DB_PORT`      | `3306`                  | MySQL port.                                   |
| `DB_USER`      | `root`                  | MySQL user.                                   |
| `DB_PASSWORD`  | *(empty)*               | MySQL password.                               |
| `DB_NAME`      | `client_requests`       | Database to use (created if missing).         |
| `TEST_DB_NAME` | `client_requests_test`  | Separate database used by `npm test`.         |

> `.env` is not auto-loaded — export the variables, or use your shell / a
> process manager to provide them (examples below).

## Run

```bash
npm install
DB_PASSWORD=rootpass npm start        # http://localhost:4000
```

## Test

Tests run against a real MySQL server (using `TEST_DB_NAME`, kept separate from
your dev data). Point them at your server the same way:

```bash
DB_PASSWORD=rootpass npm test
```

Covers all three endpoints — create, list, advance-status — with a happy path
and an error case each (missing title → 400, unknown id → 404, advancing a
`Done` request → 409). The table is truncated before each test.

## Data model

A **request**:

| Field         | Type   | Notes                                          |
| ------------- | ------ | ---------------------------------------------- |
| `id`          | number | Auto-incrementing primary key.                 |
| `title`       | string | Required, non-empty.                           |
| `description` | string | Optional, defaults to `""`.                    |
| `status`      | string | One of `New`, `In Progress`, `Done`.           |
| `createdAt`   | string | ISO 8601 timestamp set on creation.            |

Status advances one step at a time: **New → In Progress → Done**.

## API reference

Base URL: `http://localhost:4000`. All bodies are JSON.

### `POST /requests`

Create a request. New requests always start at status `New`.

**Request body**

| Field         | Type   | Required | Notes                        |
| ------------- | ------ | -------- | ---------------------------- |
| `title`       | string | yes      | Must be a non-empty string.  |
| `description` | string | no       | Defaults to `""`.            |

```bash
curl -X POST http://localhost:4000/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Add SSO login","description":"Client wants Google SSO"}'
```

**`201 Created`**

```json
{
  "id": 1,
  "title": "Add SSO login",
  "description": "Client wants Google SSO",
  "status": "New",
  "createdAt": "2026-07-06T20:15:35.347Z"
}
```

| Status | When                                          |
| ------ | --------------------------------------------- |
| `201`  | Created.                                       |
| `400`  | `title` missing/empty, or `description` not a string. |

### `GET /requests`

List all requests, newest first.

```bash
curl http://localhost:4000/requests
```

**`200 OK`**

```json
[
  {
    "id": 1,
    "title": "Add SSO login",
    "description": "Client wants Google SSO",
    "status": "New",
    "createdAt": "2026-07-06T20:15:35.347Z"
  }
]
```

| Status | When                          |
| ------ | ----------------------------- |
| `200`  | Always (array, may be empty). |

### `PATCH /requests/:id/status`

Advance a request's status one step (`New → In Progress → Done`). Takes no body.

```bash
curl -X PATCH http://localhost:4000/requests/1/status
```

**`200 OK`** — returns the updated request.

```json
{
  "id": 1,
  "title": "Add SSO login",
  "description": "Client wants Google SSO",
  "status": "In Progress",
  "createdAt": "2026-07-06T20:15:35.347Z"
}
```

| Status | When                                                    |
| ------ | ------------------------------------------------------- |
| `200`  | Status advanced.                                         |
| `400`  | `id` is not a positive integer.                         |
| `404`  | No request with that `id`.                              |
| `409`  | Request is already `Done` and cannot advance further.  |

### Error shape

All errors return a JSON object with a single `error` message:

```json
{ "error": "request not found" }
```
