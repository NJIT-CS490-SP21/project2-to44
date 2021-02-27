import { useState, useEffect, useRef } from 'react'
import Box from './Box'
import io from 'socket.io-client'
import './Board.css';

const socket = io()

function Board(props) {
    const [marks, setMarks] = useState(0)
    const [board, setBoard] = useState(Array(3).fill(Array(3).fill('')))
    const {player, players} = props
    const [x, o] = players;
    
    

    const onClickBox = (row, col) => {
        if (is_turn()) {
            markBox(row, col)
            socket.emit('move', { row: row, col: col })
        }
    }
    
    const is_turn = () => {
        if (x != player && o != player) return false
        return (x == player && ((marks % 2) == 0)) || (o == player && ((marks % 2) == 1))
    }

    const markBox = (row, col) => {
        setMarks(marks => {
            setBoard(prevBoard => {
                let nBoard = prevBoard.map((arr) => arr.slice())
                nBoard[row][col] = (marks % 2) ? 'o' : 'x'
                return nBoard
            })
    
            return marks + 1
        })
    }

    useEffect(() => {
        socket.on('move', (data) => {
            console.log('Move event received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            markBox(data.row, data.col)
        });
    }, [])

    const boxes = (() => {
        let items = []
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
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
