import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mines, setMines] = useState(20);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/board');
      setBoard(response.data);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const handleCellClick = async (row, col) => {
    try {
      const response = await axios.post('http://localhost:5000/click', { row, col });
      setBoard(response.data);
    } catch (error) {
      console.error('Error handling cell click:', error);
    }
  };

  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.revealed ? 'revealed' : ''}`}
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
