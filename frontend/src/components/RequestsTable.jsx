import { Button, StatusBadge } from './ui';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}

export default function RequestsTable({ requests, onAdvance }) {
  if (requests.length === 0) {
    return <p className="muted">No requests yet. Create one above.</p>;
  }

  return (
    <table className="requests">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Created</th>
          <th aria-label="actions" />
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => {
          const done = r.status === 'Done';
          return (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>{formatDate(r.createdAt)}</td>
              <td>
                <Button onClick={() => onAdvance(r.id)} disabled={done}>
                  {done ? 'Done' : 'Advance'}
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
