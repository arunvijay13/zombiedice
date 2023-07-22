import { useState, useEffect } from "react";
import "./DiceGame.css";

const DiceGame = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [dice, setDice] = useState([]);
  const [blast, setBlast] = useState(0);
  const [totalDice, setTotalDice] = useState(15);
  const [totalColor, setTotalColor] = useState({ red: 5, green: 5, yellow: 5 });
  const [isFirst, setIsFirst] = useState(true);

  let faces = ["footprint", "blast", "brain"];
  let colors = ["yellow", "green", "red"];

  useEffect(() => {
    calculatePointsAndBlast();
    performDiceCalculation();
  }, [dice]);

  useEffect(() => {
    if (blast >= 3) {
      endGame("blast");
    }
  }, [blast]);

  const handleRollDice = () => {
    pickDices();
  };

  const pickDices = () => {
    let rolledDice = dice.filter((dice) => dice.face === "footprint");
    if (totalDice <= 0) {
      endGame("quit");
      return;
    }
    if (isFirst) {
      setTotalDice(12);
      setIsFirst(false);
    } else {
      setTotalDice((prevTotalDice) => prevTotalDice - (3 - rolledDice.length));
    }
    rolledDice.forEach((dice) => {
      const randomIndex = Math.floor(Math.random() * faces.length);
      dice.face = faces[randomIndex];
    });
    calculateAvailableColors();
    let currLen = rolledDice.length;
    for (let i = 0; i < 3 - currLen; i++) {
      const randomColor = Math.floor(Math.random() * colors.length);
      const randomFace = Math.floor(Math.random() * faces.length);
      let randomDice = { face: faces[randomFace], color: colors[randomColor] };
      rolledDice.push(randomDice);
    }
    setDice([...rolledDice]);
  };

  const calculateAvailableColors = () => {
    if (totalColor.red <= 0) {
      colors = colors.filter((color) => color !== "red");
    } else if (totalColor.green <= 0) {
      colors = colors.filter((color) => color !== "green");
    } else if (totalColor.yellow <= 0) {
      colors = colors.filter((color) => color !== "yellow");
    }
  };

  const performDiceCalculation = () => {
    dice.forEach((dice) => {
      if (dice.face !== "footprint" && !isFirst) {
        if (dice.color === "red") {
          setTotalColor((prevState) => ({
            ...prevState,
            red: prevState.red - 1,
          }));
        } else if (dice.color === "green") {
          setTotalColor((prevState) => ({
            ...prevState,
            green: prevState.green - 1,
          }));
        } else if (dice.color === "yellow") {
          setTotalColor((prevState) => ({
            ...prevState,
            yellow: prevState.yellow - 1,
          }));
        }
      }
    });
  };

  const calculatePointsAndBlast = () => {
    let points = 0;
    let currentBlast = 0;
    dice.forEach((dice) => {
      if (dice.face === "brain") {
        if (dice.color === "green") {
          points += 1;
        } else if (dice.color === "yellow") {
          points += 2;
        } else if (dice.color === "red") {
          points += 3;
        }
      } else if (dice.face === "blast") {
        currentBlast += 1;
      }
    });
    setTotalPoints((prevPoints) => prevPoints + points);
    setBlast((prevBlast) => prevBlast + currentBlast);
  };

  const endGame = (gameEndType) => {
    if (gameEndType === "blast") {
      alert(`Your Score : 0  Blast reached ${blast}`);
    } else if (gameEndType === "quit") {
      alert(`Your Score : ${totalPoints}`);
    }
    resetGame();
  };

  const resetGame = () => {
    setTotalPoints(0);
    colors = ["yellow", "green", "red"];
    faces = ["footprint", "blast", "brain"];
    setDice([]);
    setBlast(0);
    setTotalDice(15);
    setTotalColor({ red: 5, green: 5, yellow: 5 });
    setIsFirst(true);
  };

  return (
    <div className="container">
      <div className="pointText">Points: {totalPoints}</div>
      <div className="diceContainer">
        {dice.map((dice, index) => (
          <div key={index} className="dice">
            <div
              className="diceText"
              style={{ backgroundColor: `${dice.color}` }}
            >
              {dice.face}
            </div>
          </div>
        ))}
      </div>
      <div className="buttonContainer">
        <button onClick={handleRollDice}>
          <div className="buttonText">Roll Dice</div>
        </button>
        <button onClick={resetGame}>
          <div className="buttonText">Reset</div>
        </button>
      </div>
      <div>
        <div className="quitGame" onClick={() => endGame("quit")}>
          <div className="quitText">{`quit game`}</div>
        </div>
      </div>
      <div>
        <div className="blastBoard">
          <div className="buttonText">{`Total Blast : ${blast}`}</div>
        </div>
      </div>
      <div>
        <div className="diceBoard">
          <div className="buttonText">{`Total dice : ${totalDice}`}</div>
        </div>
      </div>
      <div className="diceCount">
        <div className="countBoard" style={red}>
          <div className="buttonText">{`Red : ${
            totalColor.red < 0 ? 0 : totalColor.red
          }`}</div>
        </div>
        <div className="countBoard" style={green}>
          <div className="buttonText">{`Green : ${
            totalColor.green < 0 ? 0 : totalColor.green
          }`}</div>
        </div>
        <div className="countBoard" style={yellow}>
          <div className="buttonText" style={black}>{`yellow : ${
            totalColor.yellow < 0 ? 0 : totalColor.yellow
          }`}</div>
        </div>
      </div>
    </div>
  );
};

const yellow = {
  backgroundColor: "yellow",
};

const green = {
  backgroundColor: "green",
};

const red = {
  backgroundColor: "red",
};

const black = {
  color: "black",
};

export default DiceGame;
