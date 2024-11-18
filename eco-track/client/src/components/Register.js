import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send registration data to the server
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // To include session cookies
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess(data.message);  // Show success message
      setError(''); // Clear any previous errors
      // Redirect to login after a successful registration
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } else {
      // Log the error message for debugging and display the message on screen
      console.log('Registration failed:', data.error);  
      if (data.error === 'Email already exists') {
        setError('Email already exists');
      } else {
        setError(data.message || 'Registration failed');
      }
      setSuccess(''); // Clear any previous success messages
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;
