import { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

const AUTH_KEY = 'clientRequests.loggedIn';

export default function App() {
  // Mock auth flag only — persisted locally so a refresh keeps you signed in.
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');

  function handleLogin() {
    localStorage.setItem(AUTH_KEY, 'true');
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setLoggedIn(false);
  }

  return loggedIn ? <Dashboard onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />;
}
