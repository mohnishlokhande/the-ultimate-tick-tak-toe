import { useState } from "react";
import styles from "./GameGrid.module.css";

const matrix = [
  { id: 0, player: "" },
  { id: 1, player: "" },
  { id: 2, player: "" },
  { id: 3, player: "" },
  { id: 4, player: "" },
  { id: 5, player: "" },
  { id: 6, player: "" },
  { id: 7, player: "" },
  { id: 8, player: "" },
];

const Box = ({
  boxInfo,
  activePlayer,
  afterSelect,
  winner,
}: {
  boxInfo: any;
  activePlayer: string;
  afterSelect: Function;
  winner: string;
}) => {
  const { id, player = "" } = boxInfo;
  const onSelect = () => {
    console.log("####Select", boxInfo, activePlayer);
    afterSelect(id);
  };

  return (
    <div
      className={`${styles.box} ${
        winner !== "" && winner === player && styles.playerWinner
      }`}
      onClick={onSelect}
      data-onHover={winner === ""}
    >
      {player}
    </div>
  );
};

function checkWinner(board: any): string {
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
      return board[a].player;
    }
  }

  return "";
}

function GameGrid() {
  const [grid, setGrid] = useState(matrix);
  const [activePlayer, setActivePlayer] = useState("X");
  const [queue, setQueue] = useState<number[]>([]);
  const [winner, setWinner] = useState("");

  const afterSelect = (id: number) => {
    if (grid[id].player !== "") return;

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
  const onReset = () => {
    setGrid(matrix);
    setActivePlayer("X");
    setQueue([]);
    setWinner("");
  };

  const getCoordinate = (x: number) => {
    const col: number = Math.floor(x % 3) + 1;
    const row: number = Math.floor(x / 3) + 1;
    return (
      <div>
        {row}-{col}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.text}>Winner : {winner}</div>
      <div className={styles.text}>Turn : {activePlayer}</div>
      <div className={styles.grid}>
        {grid.map((box) => {
          return (
            <Box
              key={box.id}
              boxInfo={box}
              activePlayer={activePlayer}
              afterSelect={afterSelect}
              winner={winner}
            />
          );
        })}
      </div>
      <div className={styles.text}>
        Queue(row-col):
        {queue.map((child) => {
          return (
            <div className={styles.seqItem}>
              {getCoordinate(child)}({grid[child].player})
            </div>
          );
        })}
      </div>
      {winner !== "" && <button onClick={onReset}>Reset</button>}
    </div>
  );
}

export default GameGrid;
