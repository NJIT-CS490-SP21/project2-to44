import { useState, useEffect } from 'react'
import Box from './Box'
import io from 'socket.io-client'
import './Board.css';

const socket = io()

function Board(props) {
    const [marks, setMarks] = useState(0)
    const [board, setBoard] = useState(Array(3).fill(Array(3).fill('')))

    const onClickBox = (row, col) => {
        markBox(row, col)
        socket.emit('move', { row: row, col: col })
    }

    const markBox = (row, col) => {
        let nBoard = board.map((arr) => arr.slice())
        nBoard[row][col] = (marks % 2) ? 'o' : 'x'
        setMarks(marks + 1)
        setBoard(nBoard)
    }

    useEffect(() => {
        socket.on('move', (data) => {
            console.log('Move event received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            markBox(data.row, data.col)
          });
    }, [markBox])
    
    const boxes = (() => {
        let items = []
        for (let i = 0; i < board.length; i++) {
            for(let j = 0; j < board.length; j++) {
                items.push(<Box key={i*board.length+j} onclick={() => onClickBox(i, j)} mark={board[i][j]}/>)
            }
        }

        return items
    })()

    return (
        <div className="board">
            {boxes}
        </div>
    )
}

export default Board
