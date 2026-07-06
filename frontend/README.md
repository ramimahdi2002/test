# Client Requests — Frontend

React (Vite) single-page app for the Client Requests dashboard.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

The backend must be running (see [../backend/README.md](../backend/README.md)).

## Configuration

The backend URL is read from an environment variable, never hardcoded. Copy or
edit `.env`:

```
VITE_API_BASE_URL=http://localhost:4000
```

(See `.env.example`.)

## Structure

```
src/
  App.jsx                 Mock-auth flag; routes Login <-> Dashboard
  api.js                  Fetch wrappers for the backend endpoints
  pages/
    LoginPage.jsx         Any credentials accepted; sets the logged-in flag
    Dashboard.jsx         Loads requests, create form, advance handler
  components/
    RequestsTable.jsx     Table of requests + per-row Advance button
  styles.css
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```
