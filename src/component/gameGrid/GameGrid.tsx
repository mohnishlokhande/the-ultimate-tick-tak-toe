import { useState } from "react";
import styles from "./GameGrid.module.css";

const matrix = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
];

const Box = ({
  boxInfo,
  activePlayer,
  afterSelect,
}: {
  boxInfo: any;
  activePlayer: string;
  afterSelect: Function;
}) => {
  const { id, player = "" } = boxInfo;
  const onSelect = () => {
    console.log("####Select", boxInfo, activePlayer);
    afterSelect(id);
  };

  return (
    <div className={styles.box} onClick={onSelect}>
      {player}
    </div>
  );
};

function checkWinner(board: any): string {
  // Check rows, columns, and diagonals
  const winningCombinations = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
  ];

  for (const [a, b, c] of winningCombinations) {
    if (
      board[a]?.player &&
      board[a].player === board[b].player &&
      board[b].player === board[c].player
    ) {
      return board[a].player; // Return the winner (1 or 2)
    }
  }

  return ""; // No winner
}

function GameGrid() {
  const [grid, setGrid] = useState(matrix);
  const [activePlayer, setActivePlayer] = useState("X");
  const [queue, setQueue] = useState<number[]>([]);
  const [winner, setWinner] = useState("");

  const afterSelect = (id: number) => {
    setQueue((prev: number[]) => {
      const updatedQueue = prev.length >= 7 ? prev.slice(1) : prev;
      return [...updatedQueue, id];
    });

    setGrid((prev: any) => {
      const newGrid = [...prev];
      newGrid[id] = { ...newGrid[id], player: activePlayer };

      if (queue.length >= 7) {
        const removePlayer = queue[0];
        newGrid[removePlayer] = {
          ...newGrid[removePlayer],
          player: "",
        };
      }
      setWinner(checkWinner(newGrid));
      return newGrid;
    });

    setActivePlayer((prev: string) => (prev === "X" ? "O" : "X"));
  };

  // console.log("#####grid", grid);
  return (
    <div className={styles.container}>
      {/* <div>{queue.map((child) => child)}</div> */}
      <div>{winner}</div>
      <div className={styles.grid}>
        {grid.map((box) => {
          return (
            <Box
              key={box.id}
              boxInfo={box}
              activePlayer={activePlayer}
              afterSelect={afterSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

export default GameGrid;
