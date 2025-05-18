import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      await login({ email, password });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  }

  return (
    <form 
      onSubmit={(e) => handleLogin(e)} 
      className="max-w-md mx-auto bg-secondary-900 shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <h2 className="text-2xl font-bold mb-6 text-primary-500 text-center">Login</h2>
      <div className="mb-4">
        <label 
          htmlFor="email" 
          className="block text-secondary-200 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          onChange={e => setEmail(e.target.value)}
          className="shadow appearance-none border-primary-200 rounded w-full py-2 px-3 text-secondary-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary-500"
        />
      </div>
        <div className="mb-6">
        <label 
          htmlFor="password" 
          className="block text-secondary-200 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          onChange={e => setPassword(e.target.value)}
          className="shadow appearance-none border-dashed rounded w-full py-2 px-3 text-secondary-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-brand-light"
        />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
        )}
        <div className="flex items-center justify-between">
        <button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </div>
    </form>
  );
}