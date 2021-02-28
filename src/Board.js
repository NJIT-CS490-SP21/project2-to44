import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Box from './Box';
import './Board.css';

const socket = io();

function Board(props) {
  const [marks, setMarks] = useState(0);
  const [board, setBoard] = useState(Array(9).fill(''));
  const {
    player, players, initMoves, gameEnd,
  } = props;
  const [x, o] = players;

  const onClickBox = (pos) => {
    if (is_turn()) {
      markBox(pos);
      socket.emit('move', pos);
    }
  };

  const is_turn = () => {
    if (x != player && o != player) return false;
    return (x == player && ((marks % 2) == 0)) || (o == player && ((marks % 2) == 1));
  };

  const markBox = (pos) => {
    setMarks((marks) => {
      setBoard((prevBoard) => {
        const nBoard = prevBoard.slice();
        nBoard[pos] = (marks % 2) ? 'o' : 'x';
        return nBoard;
      });

      return marks + 1;
    });
  };

  useEffect(() => {
    if (!gameEnd) {
      setMarks(0);
      setBoard(Array(9).fill(''));
    }

    while (initMoves.length) {
      const move = initMoves.shift();
      console.log(`marking ${move}`);
      markBox(move);
    }

    socket.on('move', (data) => {
      console.log('Move event received!');
      markBox(data);
    });
  }, [gameEnd]);

  const boxes = () => board.map((val, indx) => <Box key={indx} onclick={() => onClickBox(indx)} mark={val} />);

  const spectators = (() => players.slice(2).map((el) => <li>{el}</li>))();

  return (
    <div className="boardContainer">
      <div className="board">
        { boxes() }
      </div>
      <div className="players">
        <ul>
          <li>
            x:
            {x}
          </li>
          <li>
            o:
            {o}
          </li>
        </ul>
      </div>
      <div className="spectators">
        <ul>
          {spectators}
        </ul>
      </div>
    </div>
  );
}

export default Board;
