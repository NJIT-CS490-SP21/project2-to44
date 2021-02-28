import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
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

  const isTurn = () => {
    if (x !== player && o !== player) return false;
    return (x === player && ((marks % 2) === 0)) || (o === player && ((marks % 2) === 1));
  };

  const markBox = (pos) => {
    setMarks((m) => {
      setBoard((prevBoard) => {
        const nBoard = prevBoard.slice();
        nBoard[pos] = (m % 2) ? 'o' : 'x';
        return nBoard;
      });

      return m + 1;
    });
  };

  const onClickBox = (pos) => {
    if (isTurn()) {
      markBox(pos);
      socket.emit('move', pos);
    }
  };

  useEffect(() => {
    if (!gameEnd) {
      setMarks(0);
      setBoard(Array(9).fill(''));
    }

    while (initMoves.length) {
      const move = initMoves.shift();
      markBox(move);
    }

    socket.on('move', (data) => {
      markBox(data);
    });
  }, [gameEnd]);

  const boxes = board.map((val, indx) => {
    const key = indx.toString();
    return <Box key={key} onclick={() => onClickBox(indx)} mark={val} />;
  });

  const spectators = players.slice(2).map((el, indx) => {
    const key = indx.toString();
    return <li key={key}>{el}</li>;
  });

  return (
    <div className="boardContainer">
      <div className="board">
        { boxes }
      </div>
      <div className="players">
        <ul style={{ listStyleType: 'none' }}>
          <li>Players</li>
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
        <ul style={{ listStyleType: 'none' }}>
          <li>Spectators</li>
          {spectators}
        </ul>
      </div>
    </div>
  );
}

Board.propTypes = {
  player: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  initMoves: PropTypes.arrayOf(PropTypes.number).isRequired,
  gameEnd: PropTypes.bool.isRequired,
};

export default Board;
