import logo from './logo.svg';
import './App.css';
import Board from './Board'
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [player, setPlayer] = useState(null)
  const [players, setPlayers] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element

  function onClickButton() {
    if (inputRef != null) {
      const name = inputRef.current.value;
      // If your own client sends a message, we add it to the list of messages to 
      // render it on the UI.
      setPlayer(prevPlayer => name);
      socket.emit('login', { name: name });
    }
  }

  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('connected', (data) => {
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setPlayers(data)
    });
  }, []);
  
  if (player) {
    return ( <Board play={player} players={players} /> )
  }

  
  return (
    <div>
      <h3>Name: </h3>
      <input ref={inputRef} type="text" />
      <a href="#" onClick={() => onClickButton() }>play!</a>
    </div>
  )
}

export default App;