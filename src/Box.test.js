import { render, screen } from '@testing-library/react';
import Box from './Box';

test('renders board', async () => {
  render(<div>
  <Box onclick={() => {}} mark={'x'} testid={'box-x'} />
  <Box onclick={() => {}} mark={'o'} testid={'box-o'} />
  </div>);
  const xBoxElement = await screen.findByTestId('box-x');
  expect(xBoxElement.textContent).toBe('x');
  const oBoxElement = await screen.findByTestId('box-o');
  expect(oBoxElement.textContent).toBe('o');
})
