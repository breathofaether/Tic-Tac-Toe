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

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Grid value={grid[0]} onGridClick={() => handleClick(0)} />
        <Grid value={grid[1]} onGridClick={() => handleClick(1)} />
        <Grid value={grid[2]} onGridClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Grid value={grid[3]} onGridClick={() => handleClick(3)} />
        <Grid value={grid[4]} onGridClick={() => handleClick(4)} />
        <Grid value={grid[5]} onGridClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Grid value={grid[6]} onGridClick={() => handleClick(6)} />
        <Grid value={grid[7]} onGridClick={() => handleClick(7)} />
        <Grid value={grid[8]} onGridClick={() => handleClick(8)} />
      </div>
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

  const moves = history.map((grid, index) => {
    let description;
    if (index > 0) {
      description = `Go to move #${index}`;
    } else {
      description = `Go back to the game's initial state`
    }
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    )
  })

  const currentMoveDescription = currentIndex > 0 ? `You are at move #${currentIndex + 1}`
    : "You are at the game's initial state"


  return (
    <div className="game">
      <div className="game-board"> 
      <Board isXNext={isXNext} grid={currentGrid} onPlay={handlePlay} />
      <div className="current-move">{currentMoveDescription}</div>
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