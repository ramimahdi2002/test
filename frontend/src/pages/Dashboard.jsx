import { useEffect, useState } from 'react';
import { listRequests, createRequest, advanceStatus } from '../api.js';
import RequestsTable from '../components/RequestsTable.jsx';
import { Card, Input, Button } from '../components/ui';

export default function Dashboard({ onLogout }) {
  const [requests, setRequests] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listRequests()
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      const created = await createRequest({ title, description });
      setRequests((prev) => [created, ...prev]);
      setTitle('');
      setDescription('');
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAdvance(id) {
    setError('');
    try {
      const updated = await advanceStatus(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Client Requests</h1>
        <Button variant="link" onClick={onLogout}>
          Log out
        </Button>
      </header>

      <Card as="form" className="create" onSubmit={handleCreate}>
        <h2>New request</h2>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit">Create</Button>
      </Card>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <RequestsTable requests={requests} onAdvance={handleAdvance} />
      )}
    </div>
  );
}
