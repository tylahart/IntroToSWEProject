import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLogin, handleLoginResponse } from './loginHandler';  // Import functions from loginHandler.js
import { BrowserRouter as Link} from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    // Call the fetchLogin function from loginHandler.js
    const response = await fetchLogin(email, password);

    // Use the handleLoginResponse to show success or failure
    const message = handleLoginResponse(response);
    
    if (response.success) {
      setSuccess(message);  // Show success message
      setError(''); // Clear any previous errors
      setTimeout(() => navigate('/home'), 1000); // Redirect after 2 seconds
    } else {
      setError('Email or password is incorrect');  // Show error message
      setSuccess(''); // Clear any previous success messages
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
