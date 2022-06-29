/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => {
    // return io(process.env.REACT_APP_SERVER_URL);
  }, []);

  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [message, setMessage] = useState("");
  const [word, setWord] = useState("");
  const [isinitial, setIsinitial] = useState(true);

  let startX = 0;
  let startY = 0;
  let input = [];

  let topBorder = startY - 100;
  let bottomBorder = startY + 100;
  let leftBorder = startX - 100;
  let rightBorder = startX + 100;
  let status = true;

  const handleOrientation = (event) => {
    const alphaValue = parseInt(event.alpha);
    const betaValue = parseInt(event.beta);
    const gammaValue = parseInt(event.gamma);

    if (betaValue === null || gammaValue === null) {
      setMessage("지원하지 않는 기기입니다");
    } else {
      setAlpha(alphaValue);
      setBeta(betaValue);
      setGamma(gammaValue);
    }
  };

  if (alpha < leftBorder) {
    setWord("왼");
  } else if (alpha > rightBorder) {
    setWord("오");
  } else if (beta < topBorder) {
    setWord("상");
  } else if (beta > bottomBorder) {
    setWord("하");
  } else {
    status = false;
  }

  if (status) {
    startX = alpha;
    startY = beta;
  }

  /*
  useEffect(() => {
    socket.emit("alpha", alpha);
  }, [alpha, socket]);

  useEffect(() => {
    socket.emit("beta", beta);
  }, [beta, socket]);

  useEffect(() => {
    socket.emit("gamma", gamma);
  }, [gamma, socket]);
*/

  const permission = () => {
    if (typeof DeviceOrientationEvent !== "undefined") {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission().then((response) => {
          if (response === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              false
            );
          }
        });
      } else {
        window.addEventListener("deviceorientation", handleOrientation, false);
      }
    } else {
      alert("지원하지 않는 기기입니다");
    }
  };

  const handleButtonClick = () => {
    permission();
  };

  const handleViveClick = () => {
    console.log(window.navigator);
    window.navigator.vibrate([
      100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30,
      100,
    ]);
  };

  return (
    <>
      <h1>Hello world</h1>
      <p>알파_팽이: {alpha}</p>
      <p>베타_넘어지기: {beta}</p>
      <p>감마_뒤집기: {gamma}</p>
      <p>{message}</p>
      <p>{word}</p>
      <p>{leftBorder}</p>
      <button onClick={handleButtonClick}>버튼</button>
      <button onClick={handleViveClick}>진동버튼</button>
    </>
  );
}

export default App;
