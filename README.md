# Client Requests Dashboard

A minimal internal dashboard for tracking client requests through a simple
lifecycle: **New → In Progress → Done**.

Two independent packages that only communicate over HTTP:

| Package       | Stack                                   | Default port |
| ------------- | --------------------------------------- | ------------ |
| [`backend/`](backend/)  | Node.js + Express + MySQL (mysql2)      | `4000`       |
| [`frontend/`](frontend/) | React (Vite)                            | `5173`       |

> **Auth is mock-only.** The login page accepts any input and sets a local
> flag — there are no sessions, tokens, or backend auth checks.

## Prerequisites

- Node.js 18+ (developed on Node 24) and npm.
- A running MySQL 8 server. No MySQL handy? Start one with Docker:
  `docker run -d --name cr-mysql -e MYSQL_ROOT_PASSWORD=rootpass -p 3306:3306 mysql:8`

## Setup & run

Open two terminals — one for each package.

### 1. Backend (terminal 1)

```bash
cd backend
npm install
DB_PASSWORD=rootpass npm start
```

The API starts on **http://localhost:4000**. On first run it creates the
database and table automatically — no manual schema step. Connection settings
come from environment variables (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
`DB_NAME`); see [backend/README.md](backend/README.md#configure) and
`backend/.env.example`.

### 2. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173**. The backend URL is read from
`frontend/.env` (`VITE_API_BASE_URL`, defaults to `http://localhost:4000`) — it
is never hardcoded.

Open http://localhost:5173, sign in with any credentials, and you're on the
dashboard.

## Creating a test request

The dashboard has a **New request** form — enter a title and click **Create**.

Or seed one directly against the API:

```bash
curl -X POST http://localhost:4000/requests \
  -H "Content-Type: application/json" \
  -d '{"title":"Add SSO login","description":"Client wants Google SSO"}'
```

## Running the backend tests

```bash
cd backend
DB_PASSWORD=rootpass npm test
```

Covers all three endpoints — create, list, and advance-status — with a happy
path and an error case each (missing title → 400, unknown id → 404, advancing a
`Done` request → 409). Tests use a separate database (`TEST_DB_NAME`,
default `client_requests_test`) so your dev data is never touched.

## End-to-end check

With both servers running:

1. Sign in on the login page (any credentials).
2. The dashboard loads the request table from the backend.
3. Create a request → it appears at the top of the table.
4. Click **Advance** on a row → status moves `New → In Progress → Done`; the
   button disables once `Done`.
5. Refresh the page → changes persist (they live in MySQL on the backend).

## API reference

See [backend/README.md](backend/README.md#api-reference) for endpoints,
request/response shapes, and status codes.
