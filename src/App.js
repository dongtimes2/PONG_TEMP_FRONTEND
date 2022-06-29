import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_SERVER_URL);
  }, []);

  //const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [message, setMessage] = useState("");

  const handleOrientation = (event) => {
    // const alphaValue = event.alpha;
    const betaValue = parseInt(event.beta);
    const gammaValue = parseInt(event.gamma);

    if (betaValue === null || gammaValue === null) {
      setMessage("지원하지 않는 기기입니다");
    } else {
      //setAlpha(alphaValue);
      setBeta(betaValue);
      setGamma(gammaValue);
    }
  };

  useEffect(() => {
    socket.emit("beta", beta);
  }, [beta, socket]);

  useEffect(() => {
    socket.emit("gamma", gamma);
  }, [gamma, socket]);

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
    window.navigator.vibrate(200);
  };

  return (
    <>
      <h1>Hello world</h1>
      {/* <p>알파_팽이: {alpha}</p> */}
      <p>베타_넘어지기: {beta}</p>
      <p>감마_뒤집기: {gamma}</p>
      <p>{message}</p>
      <button onClick={handleButtonClick}>버튼</button>
      <button onClick={handleViveClick}></button>
    </>
  );
}

export default App;
