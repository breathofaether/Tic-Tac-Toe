import { useState } from "react";

function Grid( {value, onGridClick} ) {
  return  <button className="grid" onClick={onGridClick}>{value}</button>
}

export default function Board() {
  const [isXNext, setIsXNext] = useState(true)
  const [grid, setGrid] = useState(Array(9).fill(null))

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

    setGrid(copyOfGrid);
    setIsXNext(!isXNext) // flip the boolean

  }

  const winner = calculateWinner(grid);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (isXNext ? "X" : "O")
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Grid value={grid[0]} onGridClick={() => handleClick(0)}/>
        <Grid value={grid[1]} onGridClick={() => handleClick(1)}/>
        <Grid value={grid[2]} onGridClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Grid value={grid[3]} onGridClick={() => handleClick(3)}/>
        <Grid value={grid[4]} onGridClick={() => handleClick(4)}/>
        <Grid value={grid[5]} onGridClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Grid value={grid[6]} onGridClick={() => handleClick(6)}/>
        <Grid value={grid[7]} onGridClick={() => handleClick(7)}/>
        <Grid value={grid[8]} onGridClick={() => handleClick(8)}/>
      </div>
    </>
  );
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
    const [a,b,c] = line; //  Destructure to get the three indexes in this line

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