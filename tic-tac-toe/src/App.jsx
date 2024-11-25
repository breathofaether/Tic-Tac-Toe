import { useState } from "react";

function Grid({ value, onGridClick }) {
  return <button className="grid" onClick={onGridClick}>{value}</button>
}

function Board({ isXNext, grid, onPlay }) {
  function handleClick(i) {
    if (grid[i] !== null || calculateWinner(grid)) {
      console.log(grid[i] !== null ? 'Cell is already filled!' : 'Winner already determined');
      return
    }

    const copyOfGrid = grid.slice()

    if (isXNext) {
      console.log('clicked *X*')
      copyOfGrid[i] = "X"
    } else {
      console.log('clicked *O*')
      copyOfGrid[i] = "O"
    }

    onPlay(copyOfGrid);

  }

  const winner = calculateWinner(grid);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Current player: " + (isXNext ? "X" : "O")
  }

  const board = Array(3).fill(null).map((_, row) => {
    const startIndexOfRow = row * 3; // Calculates the start index for each row: 
    // For row 0: 0 * 3 = 0, For row 1: 1 * 3 = 3, For row 2: 2 * 3 = 6
    const rowCells = grid.slice(startIndexOfRow, startIndexOfRow + 3); // Extracts a portion of the grid (3 cells per row):
    // For row 0: slice(0, 3), For row 1: slice(3, 6), For row 2: slice(6, 9)
    return (
      <div key={row} className="board-row">
        {rowCells.map((cellValue, col) => { // Iterates over the cells in the current row.
          // `value` represents the current cell value (either X, O, or null)
          // `col` is the index within the row (0, 1, or 2)
          const indexOfCurrentCell = startIndexOfRow + col; // Calculate the index for the current cell:
          // For column 0: index = startIndexOfRow + 0, For column 1: index = startIndexOfRow + 1, etc.
          return (
            <Grid key={indexOfCurrentCell} value={cellValue} onGridClick={() => handleClick(indexOfCurrentCell)} />
          );
        })}
      </div>
    );
  });


  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">{board}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([(Array(9).fill(null))])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isXNext = currentIndex % 2 === 0;

  const currentGrid = history[currentIndex]; // Board state of the last move

  function handlePlay(copyOfGrid) {
    const nextHistory = [...history.slice(0, currentIndex + 1), copyOfGrid];
    setHistory(nextHistory);
    setCurrentIndex(nextHistory.length - 1);
  }

  function jumpTo(nextIndex) {
    setCurrentIndex(nextIndex);
  }

  const moves = history.map((_, index) => {
    let description;

    if (index === currentIndex) {
      description = `You are at move #${index}`
    } else if (index > 0) {
      description = `Go to move #${index}`;
    } else {
      description = `Go back to the game's initial state`
    }

    return (
      <li key={index}>
        {index === currentIndex ? (
          <span>{description}</span>
        ) : (<button onClick={() => jumpTo(index)}>{description}</button>)}
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={isXNext} grid={currentGrid} onPlay={handlePlay} />
      </div>
      <div className="game-info">{moves}</div>
    </div>
  )
}


function calculateWinner(grid) {
  // Winning combinations of indexes on the board
  const winningLines = [
    [0, 1, 2], // Top Row
    [3, 4, 5], // Middle Row
    [6, 7, 8], // Botton Row
    [0, 3, 6], // Left Column
    [1, 4, 7], // Middle Column
    [2, 5, 8], // Right Column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
  ];

  for (let line of winningLines) {
    const [a, b, c] = line; //  Destructure to get the three indexes in this line

    const isNotEmpty = grid[a];
    const isEqualAB = grid[a] === grid[b];
    const isEqualAC = grid[a] === grid[c];

    // Check if all three grid in this line are the same and not null
    if (isNotEmpty && (isEqualAB && isEqualAC)) {
      return grid[a] // Return the winner ("X" or "O")
    }
  }
  return null; // No winner found 
}