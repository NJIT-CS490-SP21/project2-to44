import logo from './logo.svg';
import './App.css';
import Board from './Board'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [player, setPlayer] = useState(null)
  const [players, setPlayers] = useState([])
  const [initMoves, setInitMoves] = useState(null)
  const [gameEnd, setGameEnd] = useState(false)
  const inputRef = useRef(null)

  function onClickButton() {
    if (inputRef != null) {
      const name = inputRef.current.value;

      setPlayer(prevPlayer => name)
      socket.emit('login', { name: name })
    }
  }

  useEffect(() => {
    socket.on('connected', (data) => {
      setPlayers(data.players)
      setInitMoves(data.moves)
      setGameEnd(false)
    })

    socket.on('draw', (data) => {
      console.log("Draw")
      setGameEnd(true)
    })

    socket.on('win', (data) => {
      console.log("Win")
      setGameEnd(true)
    })
  }, [])
  
  const gePrompt = () => {
    if (gameEnd) {
      return (
        <div>
          <p>{}</p>
          <a href="#" onClick={() => { setInitMoves([]) }}>Play, again!</a>
        </div>
      )
    } else {
      return (<div/>)
    }
  }

  if (player && initMoves) {
    console.log(initMoves)
    return (
      <div>
        <Board initMoves={initMoves} player={player} players={players} />
        {gePrompt()}
      </div>
      )
  }


  return (
    <div>
      <h3>Name: </h3>
      <input ref={inputRef} type="text" />
      <a href="#" onClick={() => onClickButton() }>play!</a>
    </div>
  )
}

export default App
