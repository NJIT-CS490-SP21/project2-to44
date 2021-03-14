import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from './Box';
import './Board.css';

function Board(props) {
  const [marks, setMarks] = useState(0);
  const [board, setBoard] = useState(Array(9).fill(''));
  const { socket } = props;

  const {
    player, players, initMoves, gameEnd,
  } = props;

  const [x, o] = players;

  const isTurn = () => {
    if (x !== player && o !== player) return false;
    return (
      (x === player && marks % 2 === 0) || (o === player && marks % 2 === 1)
    );
  };

  const markBox = (pos) => {
    setMarks((m) => {
      setBoard((prevBoard) => {
        const nBoard = prevBoard.slice();
        nBoard[pos] = m % 2 ? 'o' : 'x';
        return nBoard;
      });

      return m + 1;
    });
  };

  const onClickBox = (pos) => {
    if (isTurn() && !gameEnd) {
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

  return (
    <div className="board">
      <div className="columns is-gapless is-multiline is-mobile">{boxes}</div>
      {`${marks % 2 ? 'o' : 'x'}'s turn`}
    </div>
  );
}

Board.propTypes = {
  player: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  initMoves: PropTypes.arrayOf(PropTypes.number).isRequired,
  gameEnd: PropTypes.bool.isRequired,
  socket: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Board;
