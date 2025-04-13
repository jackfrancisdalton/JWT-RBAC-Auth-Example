import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      await login({ email, password });
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}