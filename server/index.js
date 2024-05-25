const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

let board = createBoard(16, 16, 40);

app.get('/board', (req, res) => {
  board = createBoard(16, 16, 40);
  res.json(board);
});

app.post('/click', (req, res) => {
  const { row, col } = req.body;
  const result = handleCellClick(board, row, col);
  if (result.gameOver) {
    board = result.board; // Update the board state to reflect game over
    res.json({ board: result.board, gameOver: true });
  } else {
    board = result.board;
    res.json({ board: result.board, gameOver: false });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

function createBoard(rows, cols, mines) {
  let board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({
    mine: false,
    revealed: false,
    adjacentMines: 0,
  })));

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].mine) {
      board[row][col].mine = true;
      minesPlaced++;
    }
  }

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].mine) {
        directions.forEach(([dx, dy]) => {
          const newRow = row + dx;
          const newCol = col + dy;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].mine) {
            board[row][col].adjacentMines++;
          }
        });
      }
    }
  }

  return board;
}

function handleCellClick(board, row, col) {
  if (board[row][col].revealed) return { board, gameOver: false };
  board[row][col].revealed = true;
  if (board[row][col].mine) {
    console.log('Game Over');
    return { board, gameOver: true };
  } else if (board[row][col].adjacentMines === 0) {
    revealAdjacentCells(board, row, col);
  }
  return { board, gameOver: false };
}

function revealAdjacentCells(board, row, col) {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && !board[newRow][newCol].revealed) {
      handleCellClick(board, newRow, newCol);
    }
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
