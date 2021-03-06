import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Board from './Board';

const socket = io(); // Connects to socket connection

function App() {
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [initMoves, setInitMoves] = useState(null);
  const [gameEnd, setGameEnd] = useState(false);
  const [winner, setWinner] = useState(null);
  const inputRef = useRef(null);

  function onClickButton() {
    if (inputRef != null || player) {
      const name = player || inputRef.current.value;

      setPlayer(name);
      socket.emit('login', { name });
    }
  }

  useEffect(() => {
    socket.on('connected', (data) => {
      setPlayers(data.players);
      setInitMoves(data.moves);

      setPlayer((p) => {
        if (data.players.find((v) => v === p)) setGameEnd(false);
        return p;
      });
    });

    socket.on('draw', () => {
      setGameEnd(true);
    });

    socket.on('win', (data) => {
      setGameEnd(() => {
        setWinner(data);
        return true;
      });
    });
  }, []);

  const gePrompt = () => {
    if (gameEnd) {
      return (
        <div>
          <p>
            {`Player ${players[winner]} wins!`}
          </p>
          <button type="button" onClick={() => { onClickButton(); setInitMoves([]); }}>Play, again!</button>
        </div>
      );
    }
    return (<div />);
  };

  if (player && initMoves) {
    return (
      <div>
        <Board
          gameEnd={gameEnd}
          initMoves={initMoves}
          player={player}
          players={players}
          socket={socket}
        />
        {gePrompt()}
      </div>
    );
  }

  return (
    <div>
      <h3>Name: </h3>
      <input ref={inputRef} type="text" />
      <button type="button" onClick={() => onClickButton()}>play!</button>
    </div>
  );
}

export default App;
