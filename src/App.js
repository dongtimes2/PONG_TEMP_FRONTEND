import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

function App() {
  const socket = useMemo(() => {
    return io(process.env.REACT_APP_SERVER_URL);
  }, [])

  const [x, setValue] = useState(0);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  const handleMotion = (event) => {
    const x = event.acceleration.x;
    // console.log(event)
    setValue(x);
  };

  const handleOrientation = (event) => {
    const alphaValue = event.alpha;
    const betaValue = event.beta;
    const gammaValue = event.gamma;

    setAlpha(alphaValue);
    setBeta(betaValue);
    setGamma(gammaValue);
  };

  useEffect(() => {
    window.addEventListener('devicemotion', handleMotion, false);
    window.addEventListener('deviceorientation', handleOrientation, false);
  }, [x, alpha, beta, gamma]);

  // function handleMotion(event) {
  //   console.log(event);
  // }

  // window.addEventListener('devicemotion', handleMotion);

  const handleButtonClick = () => {
    const response = new Date();
    socket.emit('button', response);
  }

  return (
    <>
      <h1>Hello world</h1>
      <p id='temp'></p>
      <p>{x}</p>
      <p>알파_팽이: {alpha}</p>
      <p>베타_넘어지기: {beta}</p>
      <p>감마_뒤집기: {gamma}</p>
      <button onClick={handleButtonClick}>버튼</button>
    </>
  );
}

export default App;
