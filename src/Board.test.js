import { render, screen } from '@testing-library/react';
import Board from './Board';

test('renders board', async () => {
  render(<Board player='test1' players={['test1', 'test2', 'test3']} gameEnd={false} socket={Object()} initMoves={[0,1,2,4]} />);
  const xBoxElement = await screen.findByTestId('box-0');
  expect(xBoxElement.textContent).toBe('x');
  const oBoxElement = await screen.findByTestId('box-1');
  expect(oBoxElement.textContent).toBe('o');
})