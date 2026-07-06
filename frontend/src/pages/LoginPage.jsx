import { useState } from 'react';
import { Card, Input, Button } from '../components/ui';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // Mock auth: any input is accepted, no backend check.
    onLogin();
  }

  return (
    <div className="centered">
      <Card as="form" className="login" onSubmit={handleSubmit}>
        <h1>Client Requests</h1>
        <p className="muted">Sign in to continue — any credentials work.</p>

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit">Sign in</Button>
      </Card>
    </div>
  );
}
