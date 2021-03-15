import { render, screen } from '@testing-library/react';
import App from './App';

test('renders play button without board', () => {
  render(<App />);
  const playElement = screen.getByText(/Play!/i);
  expect(playElement).toBeInTheDocument();
  const boardElement = screen.queryByTestId('board');
  expect(boardElement).not.toBeInTheDocument();
});
