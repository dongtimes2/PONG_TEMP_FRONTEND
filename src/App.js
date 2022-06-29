import { useState, useRef, useCallback } from "react";
import "./App.css";
//import { io } from "socket.io-client";

function App() {
  /*
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_SERVER_URL);
  }, []);
*/

  const [message, setMessage] = useState("");
  const [memory, setMemory] = useState([]);

  const alpha = useRef(0);
  const beta = useRef(0);
  const gamma = useRef(0);

  const startX = useRef(0);
  const startY = useRef(0);

  const topBorder = useRef(0);
  const bottomBorder = useRef(0);
  const leftBorder = useRef(0);
  const rightBorder = useRef(0);

  const status = useRef(true);
  const status2 = useRef(true);

  const lastInput = useRef("");

  const handleOrientation = useCallback((event) => {
    const alphaValue = parseInt(event.alpha);
    const betaValue = parseInt(event.beta);
    const gammaValue = parseInt(event.gamma);
    status2.current = true;

    console.log("알파", alpha.current);
    console.log("좌", leftBorder.current);
    console.log("우", rightBorder.current);

    if (isNaN(alphaValue || betaValue || gammaValue)) {
      setMessage("지원하지 않는 기기입니다");
    } else {
      alpha.current = alphaValue;
      beta.current = betaValue;
      gamma.current = gammaValue;
    }

    if (status.current) {
      startX.current = alpha.current;
      startY.current = beta.current;
      status.current = false;
    }

    topBorder.current = startY.current + 15;
    bottomBorder.current = startY.current - 15;

    if (alpha.current > 180) {
      alpha.current -= 361;
    }

    leftBorder.current = startX.current + 11;
    rightBorder.current = startX.current - 11;

    if (beta.current > topBorder.current) {
      if (lastInput.current !== "상") {
        lastInput.current = "상";
        setMemory((prev) => [...prev, "상"]);
      }
    } else if (beta.current < bottomBorder.current) {
      if (lastInput.current !== "하") {
        lastInput.current = "하";
        setMemory((prev) => [...prev, "하"]);
      }
    } else if (alpha.current > leftBorder.current) {
      if (lastInput.current !== "좌") {
        lastInput.current = "좌";
        setMemory((prev) => [...prev, "좌"]);
      }
    } else if (alpha.current < rightBorder.current) {
      if (lastInput.current !== "우") {
        lastInput.current = "우";
        setMemory((prev) => [...prev, "우"]);
      }
    } else {
      status2.current = false;
    }

    if (status2.current) {
      startX.current = alpha.current;
      startY.current = beta.current;
    }
  }, []);

  const permission = () => {
    if (typeof DeviceOrientationEvent !== "undefined") {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        });
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } else {
      alert("지원하지 않는 기기입니다");
    }
  };

  const handleButtonClick = () => {
    permission();
  };

  const handleViveClick = () => {
    window.navigator.vibrate([
      100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30,
      100,
    ]);
  };

  const reset = () => {
    setMemory([]);
  };

  const handleMode = () => {
    console.log("ee");
    reset();
    window.removeEventListener("deviceorientation", handleOrientation);
    lastInput.current = "";
    status.current = true;
  };

  return (
    <>
      <h1>Hello world</h1>
      {/* <p>알파_팽이: {alpha}</p> */}
      {/* <p>베타_넘어지기: {beta}</p> */}
      {/* <p>감마_뒤집기: {gamma}</p> */}
      <p>{message}</p>
      <button onClick={handleButtonClick}>버튼</button>
      <button onClick={handleViveClick}>진동버튼</button>
      <button onClick={reset}>클리어</button>
      <button onClick={handleMode}>모드 변경</button>
      {memory.map((element) => (
        <p>{element}</p>
      ))}
    </>
  );
}

export default App;

/*
  if (alpha < leftBorder) {
    setWord("왼");
  } else if (alpha > rightBorder) {
    setWord("오");
  } else if (beta < topBorder) {
    setWord("상");
  } else if (beta > bottomBorder) {
    setWord("하");
  } else {
    console.log();
    //status = false;
  }
  /*
  if (status) {
    startX = alpha;
    startY = beta;
  }
*/

// console.log("팽이", alpha.current); //344
// console.log("넘어지기", beta.current);
//console.log("뒤집기", gamma.current);
// console.log("탑바", topBorder.current);
// console.log("바텀바", bottomBorder.current);

// console.log("레프트", leftBorder.current); //355
// console.log("라이트", rightBorder.current); //333
