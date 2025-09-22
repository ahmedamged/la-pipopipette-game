import React from "react";

export const GameModal = ({
  setIsShown,
  boardSize,
  setBoardSize,
  setFirstPlayer,
  setSecondPlayer,
  gameInstructionsShow,
  setGameInstructionsShow,
}) => {
  const handleStartBtn = () => {
    setIsShown((prev) => !prev);
  };
  return (
    <div className="modal-layout">
      <div className="modal">
        <h1 className="modal-title">Size of Board</h1>
        <form onSubmit={handleStartBtn}>
          <select
            value={boardSize}
            onChange={(e) => setBoardSize(e.target.value)}
            name="grid-size"
            className="modal-select"
          >
            <option value="three-by-three">3 * 3</option>
            <option value="four-by-four">4 * 4</option>
            <option value="four-by-five">5 * 4</option>
          </select>
          <div className="player-names">
            <label htmlFor="player1">
              First Player Name - &#40;Darkblue&#41;
            </label>
            <input
              type="text"
              id="player1"
              onChange={(e) => setFirstPlayer(e.target.value)}
            />
            <label htmlFor="player2">
              Second Player Name - &#40;Maroon&#41;
            </label>
            <input
              type="text"
              id="player2"
              onChange={(e) => setSecondPlayer(e.target.value)}
            />
            <label className="game-instructions-label">
              Show Game Instructions
            </label>
            <div>
              <input
                type="radio"
                name="booleanOption"
                value="true"
                id="show-instructions"
                checked={gameInstructionsShow === true}
                onChange={(e) =>
                  setGameInstructionsShow(e.target.value === "true")
                }
              />
              <label className="game-options-label" htmlFor="show-instructions">
                Yes
              </label>
              <input
                type="radio"
                name="booleanOption"
                value="false"
                id="hide-instructions"
                checked={gameInstructionsShow === false}
                onChange={(e) =>
                  setGameInstructionsShow(e.target.value === "true")
                }
              />
              <label className="game-options-label" htmlFor="hide-instructions">
                No
              </label>
            </div>
          </div>
          <button type="submit" className="modal-btn">
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};
