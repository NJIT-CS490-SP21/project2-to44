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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

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
      setWinner(null);
      setGameEnd(true);
    });

    socket.on('win', (data) => {
      setGameEnd(() => {
        setWinner(data);
        return true;
      });
    });
  }, []);

  const getLoaderboard = () => {
    const rows = leaderboard.map((row, indx) => (
      <tr className={row.username === player ? 'is-selected' : ''}>
        <td>{indx + 1}</td>
        <td>{row.username}</td>
        <td>{row.score}</td>
      </tr>
    ));

    return (
      <div className={`modal ${showLeaderboard ? 'is-active' : ''}`}>
        <div role="presentation" className="modal-background" onClick={() => { setShowLeaderboard(!showLeaderboard); }} />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Leaderboard</p>
            <button type="button" onClick={() => { setShowLeaderboard(!showLeaderboard); }} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th><abbr title="Position">Pos</abbr></th>
                  <th><abbr title="Username">Username</abbr></th>
                  <th><abbr title="Score">Score</abbr></th>
                </tr>
              </thead>
              <tbody>
                {rows}
                <tr />
              </tbody>
            </table>
          </section>
        </div>
      </div>
    );
  };

  const fetchLaderboard = async () => {
    const res = await fetch('/leaderboard');
    const json = await res.json();
    setLeaderboard(json);
  };

  const endPrompt = () => {
    if (gameEnd) {
      fetchLaderboard();

      return (
        <div className="content is-medium">
          <p>
            {players[winner] ? `Player ${players[winner]} wins!` : 'It\'s a tie!'}
          </p>
          <div className="field is-grouped">
            <p className="control">
              <button className="button" type="button" onClick={() => { setShowLeaderboard(!showLeaderboard); }}>Leaderboard</button>
            </p>
            <p className="control">
              <button className="button" type="button" onClick={() => { onClickButton(); setInitMoves([]); }}>Play, again!</button>
            </p>
          </div>
        </div>
      );
    }
    return (<div />);
  };

  const getPlayers = () => {
    const [x, o] = players;

    return (
      <div className="content">
        {x ? (
          <h5>
            {'Player x: '}
            <span className={`is-medium tag is-light ${(player === x) ? 'is-link' : ''}`}>{x}</span>
          </h5>
        ) : null }
        {o ? (
          <h5>
            {'Player o: '}
            <span className={`is-medium tag is-light ${(player === o) ? 'is-link' : ''}`}>{o}</span>
          </h5>
        ) : null }
        <h5>Spectators:</h5>
        <div className="tags">
          { players.slice(2).map((p) => {
            const classes = `is-medium tag is-light ${(player === p) ? 'is-link' : ''}`;
            return (<span className={classes}>{p}</span>);
          })}
        </div>
      </div>
    );
  };

  if (player && initMoves) {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <Board
                gameEnd={gameEnd}
                initMoves={initMoves}
                player={player}
                players={players}
                socket={socket}
              />
            </div>
            <div className="column">
              {getPlayers()}
              {endPrompt()}
              {getLoaderboard()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="field has-addons">
          <div className="control">
            <input className="input" ref={inputRef} type="text" placeholder="Username" />
          </div>
          <div className="control">
            <button className="button" type="button" onClick={() => onClickButton()}>
              Play!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
