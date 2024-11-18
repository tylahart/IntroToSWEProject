import React, { useState} from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages
    console.log("Submitting login with:", { email, password }); // For debugging

    try {
      // Send login data to the server
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // Send cookies with request if needed
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
      } else {
        console.log("Login successful:", data);
        setSuccess('Login successful! Redirecting...');
        // Redirect logic (using useNavigate or window.location)
        setTimeout(() => {
          // You can use `useNavigate()` if you're using React Router, or:
          window.location.href = '/Wasteform'; // Redirect to the dashboard (example)
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      {/* Form with onSubmit attached to handleSubmit */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Bind email state
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Bind password state
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      
      <a href="/register">New to Eco-track? Register</a>
    </div>
  );
};

export default Login;
