// logoutHandler.js

const handleLogout = async (navigate) => {
    try {
      // Send a DELETE request to log the user out
      const response = await fetch('http://localhost:8080/logout', {
        method: 'DELETE',
        credentials: 'include', // Ensure session cookies are included
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Redirect the user to the login page after successful logout
        navigate('/login');
      } else {
        // Handle any errors during logout
        console.log('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  export default handleLogout;
  