import { useEffect, useRef, useState } from "react";
import "./App.css";
import { GameModal } from "./components/GameModal";
import LineBetweenPoints from "./components/LineBetweenPoints";

let point1 = { x: null, y: null };
let color = "";
let point1RowIndex = 0;
let point1CellIndex = 0;
let point2RowIndex = 0;
let point2CellIndex = 0;
let allBoxesCount = 0;
let boxesCompletedCount = 0;
function App() {
  const [modalIsShown, setModalIsShown] = useState(true);
  const [boardSize, setBoardSize] = useState("four-by-four");
  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [lines, setLines] = useState([]);
  const [linesDrawn, setLinesDrawn] = useState([]);
  const [diagonalLines, setDiagonalLines] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [boxes, setBoxes] = useState([]);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [firstPlayer, setFirstPlayer] = useState("");
  const [secondPlayer, setSecondPlayer] = useState("");
  const [firstPlayerScore, setFirstPlayerScore] = useState(0);
  const [secondPlayerScore, setSecondPlayerScore] = useState(0);
  const [firstPlayerRoundScore, setFirstPlayerRoundScore] = useState(0);
  const [secondPlayerRoundScore, setSecondPlayerRoundScore] = useState(0);
  const [keepPlaying, setKeepPlaying] = useState(true);
  const [gameInstructions, setGameInstructions] = useState(true);
  const [gameInstructionsShow, setGameInstructionsShow] = useState(false);
  const dotsRefs = useRef([]);

  const createDynamicMatrix = (rows, cols, initialValue = 0) => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = initialValue;
      }
    }
    return matrix;
  };

  const checkToDrawLine = (linePoints) => {
    let drawLine = true;
    if (linesDrawn.length === 0) {
      return true;
    } else {
      for (let line of linesDrawn) {
        if (
          linePoints[0][0] === line[0][0] &&
          linePoints[0][1] === line[0][1] &&
          linePoints[1][0] === line[1][0] &&
          linePoints[1][1] === line[1][1]
        ) {
          drawLine = false;
        }
      }
      return drawLine;
    }
  };

  const createDiagonalLinesForCompletedBox = (
    boxStartRow,
    boxStartCol,
    color
  ) => {
    const rect1 =
      dotsRefs.current[boxStartRow][boxStartCol].getBoundingClientRect();
    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const diagonalPoint1 = { x: centerX1, y: centerY1 };
    const rect2 =
      dotsRefs.current[boxStartRow + 1][
        boxStartCol + 1
      ].getBoundingClientRect();
    const centerX2 = rect2.left + rect2.width / 2;
    const centerY2 = rect2.top + rect2.height / 2;
    const diagonalPoint2 = { x: centerX2, y: centerY2 };
    const rect3 =
      dotsRefs.current[boxStartRow][boxStartCol + 1].getBoundingClientRect();
    const centerX3 = rect3.left + rect3.width / 2;
    const centerY3 = rect3.top + rect3.height / 2;
    const diagonalPoint3 = { x: centerX3, y: centerY3 };
    const rect4 =
      dotsRefs.current[boxStartRow + 1][boxStartCol].getBoundingClientRect();
    const centerX4 = rect4.left + rect4.width / 2;
    const centerY4 = rect4.top + rect4.height / 2;
    const diagonalPoint4 = { x: centerX4, y: centerY4 };
    setDiagonalLines((prevDiagonalLines) => [
      ...prevDiagonalLines,
      {
        linep1: diagonalPoint1,
        linep2: diagonalPoint2,
        color,
      },
      {
        linep1: diagonalPoint3,
        linep2: diagonalPoint4,
        color,
      },
    ]);
  };

  const checkCompletedBoxes = (newlinesDrawn, color) => {
    let completed = false;
    for (let [index, box] of boxes.entries()) {
      if (box.color === "") {
        const topLineDrawn = newlinesDrawn.some(
          (line) =>
            line[0][0] === box.boxStartRow &&
            line[0][1] === box.boxStartCol &&
            line[1][0] === box.boxStartRow &&
            line[1][1] === box.boxStartCol + 1
        );
        const bottomLineDrawn = newlinesDrawn.some(
          (line) =>
            line[0][0] === box.boxStartRow + 1 &&
            line[0][1] === box.boxStartCol &&
            line[1][0] === box.boxStartRow + 1 &&
            line[1][1] === box.boxStartCol + 1
        );
        const leftLineDrawn = newlinesDrawn.some(
          (line) =>
            line[0][0] === box.boxStartRow &&
            line[0][1] === box.boxStartCol &&
            line[1][0] === box.boxStartRow + 1 &&
            line[1][1] === box.boxStartCol
        );
        const rightLineDrawn = newlinesDrawn.some(
          (line) =>
            line[0][0] === box.boxStartRow &&
            line[0][1] === box.boxStartCol + 1 &&
            line[1][0] === box.boxStartRow + 1 &&
            line[1][1] === box.boxStartCol + 1
        );
        if (
          topLineDrawn &&
          bottomLineDrawn &&
          leftLineDrawn &&
          rightLineDrawn
        ) {
          const newBoxes = [...boxes];
          newBoxes[index].color = color;
          setBoxes(newBoxes);
          if (color === "darkblue") {
            setFirstPlayerScore((prev) => prev + 1);
            setFirstPlayerRoundScore((prev) => prev + 1);
          } else if (color === "maroon") {
            setSecondPlayerScore((prev) => prev + 1);
            setSecondPlayerRoundScore((prev) => prev + 1);
          }
          createDiagonalLinesForCompletedBox(
            box.boxStartRow,
            box.boxStartCol,
            color
          );
          completed = true;
          boxesCompletedCount += 1;
          if (boxesCompletedCount === allBoxesCount) {
            setKeepPlaying(false);
            if (gameInstructionsShow) {
              setGameInstructions(true);
            }
          }
        }
      }
    }
    if (completed) {
      setIsPlayer1((prev) => !prev);
      if (gameInstructionsShow) {
        setGameInstructions(false);
      }
    } else {
      if (gameInstructionsShow) {
        setGameInstructions(true);
      }
    }
  };

  const handleDotClick = (e, rowIndex, cellIndex) => {
    if (firstClick) {
      if (dotsRefs.current[rowIndex][cellIndex]) {
        const rect =
          dotsRefs.current[rowIndex][cellIndex].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        point1 = { x: centerX, y: centerY };
      }
      point1RowIndex = rowIndex;
      point1CellIndex = cellIndex;
      setFirstClick((prev) => !prev);
    } else {
      let point2;
      if (dotsRefs.current[rowIndex][cellIndex]) {
        const rect =
          dotsRefs.current[rowIndex][cellIndex].getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        point2 = { x: centerX, y: centerY };
      }
      point2RowIndex = rowIndex;
      point2CellIndex = cellIndex;
      if (
        point1RowIndex === point2RowIndex &&
        point1CellIndex === point2CellIndex
      ) {
        return;
      }
      if (
        (point1RowIndex === point2RowIndex + 1 &&
          point1CellIndex === point2CellIndex) ||
        (point1RowIndex === point2RowIndex &&
          point1CellIndex === point2CellIndex + 1) ||
        (point1RowIndex === point2RowIndex &&
          point1CellIndex === point2CellIndex - 1) ||
        (point1RowIndex === point2RowIndex - 1 &&
          point1CellIndex === point2CellIndex)
      ) {
        const linePoints = [
          [point1RowIndex, point1CellIndex],
          [point2RowIndex, point2CellIndex],
        ];
        linePoints.sort();

        if (checkToDrawLine(linePoints)) {
          const newlinesDrawn = [...linesDrawn];
          newlinesDrawn.push(linePoints);
          if (isPlayer1) {
            color = "darkblue";
            setIsPlayer1((prev) => !prev);
          } else {
            color = "maroon";
            setIsPlayer1((prev) => !prev);
          }
          setLinesDrawn(newlinesDrawn);
          const newLines = [...lines];
          newLines.push({
            linep1: point1,
            linep2: point2,
            color,
          });
          setLines(newLines);
          checkCompletedBoxes(newlinesDrawn, color);
        }
      }
      setFirstClick((prev) => !prev);
    }
  };

  const initiateBoxes = (rows, cols) => {
    let initialBoxes = [];
    for (let boxStartRow = 0; boxStartRow < rows - 1; boxStartRow++) {
      for (let boxStartCol = 0; boxStartCol < cols - 1; boxStartCol++) {
        initialBoxes.push({ boxStartRow, boxStartCol, color: "" });
      }
    }
    setBoxes(initialBoxes);
    allBoxesCount = initialBoxes.length;
  };

  const resetGame = () => {
    let rows;
    let cols;
    if (boardSize === "three-by-three") {
      rows = 3;
      cols = 3;
    } else if (boardSize === "four-by-four") {
      rows = 4;
      cols = 4;
    } else if (boardSize === "four-by-five") {
      rows = 4;
      cols = 5;
    }
    initiateBoxes(rows, cols);
    setLines([]);
    setLinesDrawn([]);
    setDiagonalLines([]);
    setIsPlayer1(true);
    setFirstClick(true);
    setKeepPlaying(true);
    setFirstPlayerRoundScore(0);
    setSecondPlayerRoundScore(0);
    boxesCompletedCount = 0;
    if (gameInstructionsShow) {
      setGameInstructions(true);
    }
  };

  useEffect(() => {
    let boardMatrix;
    let rows;
    let cols;
    if (boardSize === "three-by-three") {
      boardMatrix = createDynamicMatrix(3, 3, null);
      setBoard(boardMatrix);
      rows = 3;
      cols = 3;
    } else if (boardSize === "four-by-four") {
      boardMatrix = createDynamicMatrix(4, 4, null);
      setBoard(boardMatrix);
      rows = 4;
      cols = 4;
    } else if (boardSize === "four-by-five") {
      boardMatrix = createDynamicMatrix(4, 5, null);
      setBoard(boardMatrix);
      rows = 4;
      cols = 5;
    }
    initiateBoxes(rows, cols);
  }, [boardSize]);
  return (
    <>
      <div>
        {modalIsShown ? (
          <GameModal
            setIsShown={setModalIsShown}
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            setFirstPlayer={setFirstPlayer}
            setSecondPlayer={setSecondPlayer}
            gameInstructionsShow={gameInstructionsShow}
            setGameInstructionsShow={setGameInstructionsShow}
          />
        ) : null}
      </div>
      <div>
        <div className="scoreboard">
          <p>
            {firstPlayer}{" "}
            <span className="first-player-color">&#40;Darkblue&#41;</span> is{" "}
            {firstPlayerScore}
          </p>
          <hr />
          <p>
            {secondPlayer}{" "}
            <span className="second-player-color">&#40;Maroon&#41;</span> is{" "}
            {secondPlayerScore}
          </p>
        </div>
      </div>

      {keepPlaying ? (
        <div className="keep-playing-section">
          <h3 className="keep-playing-title">Keep</h3>
          <h3 className="keep-playing-title">Playing</h3>
        </div>
      ) : (
        <div className="keep-playing-section">
          <h3 className="keep-playing-title">
            {firstPlayer} &#40;Darkblue&#41; has won {firstPlayerRoundScore}{" "}
            {firstPlayerScore === 1 ? "box" : "boxes"}
          </h3>
          <h3 className="keep-playing-title">
            {secondPlayer} &#40;Maroon&#41; has won {secondPlayerRoundScore}{" "}
            {secondPlayerScore === 1 ? "box" : "boxes"}
          </h3>
        </div>
      )}
      {gameInstructionsShow ? (
        gameInstructions ? (
          <p>Complete the largest number of boxes</p>
        ) : (
          <p>Your turn again</p>
        )
      ) : null}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="dot"
                ref={(el) => {
                  if (!dotsRefs.current[rowIndex]) {
                    dotsRefs.current[rowIndex] = [];
                  }
                  dotsRefs.current[rowIndex][cellIndex] = el;
                }}
                onClick={(e) => handleDotClick(e, rowIndex, cellIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      {lines.map((line, index) => (
        <LineBetweenPoints
          key={index}
          point1={line.linep1}
          point2={line.linep2}
          stroke={line.color}
        />
      ))}
      {diagonalLines.map((line, index) => (
        <LineBetweenPoints
          key={index}
          point1={line.linep1}
          point2={line.linep2}
          stroke={line.color}
        />
      ))}
      <button onClick={resetGame} className="reset-btn">
        Reset Game
      </button>
    </>
  );
}

export default App;
