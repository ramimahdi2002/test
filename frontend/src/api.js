// Base URL comes from the environment (see .env), never hardcoded.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function listRequests() {
  return fetch(`${BASE_URL}/requests`).then(handle);
}

export function createRequest({ title, description }) {
  return fetch(`${BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  }).then(handle);
}

export function advanceStatus(id) {
  return fetch(`${BASE_URL}/requests/${id}/status`, { method: 'PATCH' }).then(handle);
}
