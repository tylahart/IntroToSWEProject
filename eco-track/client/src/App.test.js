// Import necessary functions from the testing library
import { render, screen } from '@testing-library/react';
// Import the App component to test
import App from './App';

// Define a test case named "renders learn react link"
test('renders learn react link', () => {
  // Render the App component within the testing environment
  render(<App />);

  // Query the document for an element containing the text "learn react"
  const linkElement = screen.getByText(/learn react/i); // Using regular expression to match text, case-insensitive

  // Assert that the element is present in the document
  expect(linkElement).toBeInTheDocument();
});
