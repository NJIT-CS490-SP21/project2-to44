import logo from './logo.svg';
import './App.css';
import Board from './Board';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

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

      setPlayer((player) => {
        if (data.players.find((v) => v === player)) setGameEnd(false);
        return player;
      });
    });

    socket.on('draw', (data) => {
      console.log('Draw');
      setGameEnd(true);
    });

    socket.on('win', (data) => {
      console.log('Win');
      setWinner(data);
      setGameEnd(true);
    });
  }, []);

  const gePrompt = () => {
    if (gameEnd) {
      console.log(players[winner]);
      return (
        <div>
          <p>
            {players[winner]}
            {' '}
            wins!
          </p>
          <a href="#" onClick={() => { onClickButton(); setInitMoves([]); }}>Play, again!</a>
        </div>
      );
    }
    return (<div />);
  };

  if (player && initMoves) {
    return (
      <div>
        <Board gameEnd={gameEnd} initMoves={initMoves} player={player} players={players} />
        {gePrompt()}
      </div>
    );
  }

  return (
    <div>
      <h3>Name: </h3>
      <input ref={inputRef} type="text" />
      <a href="#" onClick={() => onClickButton()}>play!</a>
    </div>
  );
}

export default App;
