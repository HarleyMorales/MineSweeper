import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/board');
      setBoard(response.data);
      setGameOver(false);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const handleCellClick = async (row, col) => {
    if (gameOver) return;

    try {
      const response = await axios.post('http://localhost:5000/click', { row, col });
      setBoard(response.data.board);
      if (response.data.gameOver) {
        setGameOver(true);
        alert('Game Over! You hit a mine.');
      }
    } catch (error) {
      console.error('Error handling cell click:', error);
    }
  };

  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <button onClick={fetchBoard}>Restart Game</button>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.revealed ? 'revealed' : ''} ${cell.mine && cell.revealed ? 'mine' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell.revealed ? (cell.mine ? '💣' : cell.adjacentMines) : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
