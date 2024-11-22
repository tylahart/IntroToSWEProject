// loginHandler.js

const fetchLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are included if necessary
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();  // Get the raw response text (could be HTML)
      throw new Error(errorText || 'Login failed');
    }

    // If response is okay, parse the JSON
    const data = await response.json();
    return { success: true, message: data.message };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
};


const handleLoginResponse = (response) => {
  if (response.success) {
    // Handle success (e.g., navigate to the next page, show success message)
    console.log('Login Successful:', response.message);
    return response.message;
  } else {
    // Handle failure (e.g., show error message)
    console.log('Login Failed:', response.message);
    return response.message;
  }
};

module.exports = { fetchLogin, handleLoginResponse };
