import { useRef, useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ControllerPage } from '../constants/page';
import SocketEvent from '../constants/socket';
import {
  registerControllerId,
  controllerCompatibilityFailure,
  controllerCompatibilitySuccess,
  socket,
  startMotionSetting,
  sendSensorData,
  sendExit,
  switchMotionSettingPage,
  disconnectController,
  sendControllerJoinGame,
  sendBeta,
  requestExitGame,
  sendMoveUp,
  sendMoveDown,
  sendMoveLeft,
  sendMoveRight,
  sendStopDetectMotion,
} from '../utils/socketAPI';

export default function Controller() {
  const [controllerPage, setControllerPage] = useState(ControllerPage.DEFAULT);
  const [isMotionChangingMode, setIsMotionChangingMode] = useState(false);
  const [isDetectingMotion, setIsDetectingMotion] = useState(false);

  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const betaCache = useRef(0);

  const startX = useRef(0);
  const startY = useRef(0);

  const topBorder = useRef(0);
  const bottomBorder = useRef(0);
  const leftBorder = useRef(0);
  const rightBorder = useRef(0);
  const lastInput = useRef('');

  const isCompatibilityChecked = useRef(false);
  const initialCheck = useRef(true);

  const params = useParams();

  const deviceMotionEmitter = (paramAlpha, paramBeta) => {
    if (isDetectingMotion) {
      let sendCheck = true;

      if (paramAlpha > 180) {
        paramAlpha -= 361;
      }

      if (initialCheck.current) {
        startX.current = paramAlpha;
        startY.current = paramBeta;
        initialCheck.current = false;
      }

      topBorder.current = startY.current + 20;
      bottomBorder.current = startY.current - 20;

      leftBorder.current = startX.current + 20;
      rightBorder.current = startX.current - 20;

      if (paramBeta > topBorder.current) {
        if (lastInput.current !== 'up') {
          lastInput.current = 'up';
          sendMoveUp();
        }
      } else if (paramBeta < bottomBorder.current) {
        if (lastInput.current !== 'down') {
          lastInput.current = 'down';
          sendMoveDown();
        }
      } else if (paramAlpha > leftBorder.current) {
        if (lastInput.current !== 'left') {
          lastInput.current = 'left';
          sendMoveLeft();
        }
      } else if (paramAlpha < rightBorder.current) {
        if (lastInput.current !== 'right') {
          lastInput.current = 'right';
          sendMoveRight();
        }
      } else {
        sendCheck = false;
      }

      if (sendCheck) {
        startX.current = paramAlpha;
        startY.current = paramBeta;
      }
    } else {
      lastInput.current = '';
      initialCheck.current = true;
    }
  };

  const sensorValueEmitter = (paramBeta) => {
    if (betaCache.current !== paramBeta) {
      sendBeta(paramBeta);
      betaCache.current = paramBeta;
    }
  };

  const getCompatibilityCheckHistory = () => {
    return isCompatibilityChecked.current;
  };

  const compatibilityChecked = () => {
    isCompatibilityChecked.current = true;
  };

  const handleOrientation = useCallback((event) => {
    const compatibilityChecker = (event) => {
      const result = getCompatibilityCheckHistory();

      if (!result) {
        compatibilityChecked();

        if (!(event.alpha || event.beta)) {
          controllerCompatibilityFailure();
          return;
        } else {
          controllerCompatibilitySuccess();
        }
      }
    };

    const sensorValueSetter = (paramAlpha, paramBeta) => {
      let intAlpha = parseInt(paramAlpha);
      let intBeta = parseInt(paramBeta);

      setAlpha(intAlpha);
      setBeta(intBeta);
    };

    compatibilityChecker(event);
    sensorValueSetter(event.alpha, event.beta);
  }, []);

  const sensorActivate = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const response = await DeviceOrientationEvent.requestPermission();

        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      controllerCompatibilityFailure();
    }
  }, [handleOrientation]);

  const sensorDeactivate = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation);
  }, [handleOrientation]);

  useEffect(() => {
    registerControllerId(params.userId);

    socket.on(SocketEvent.LOAD_CONTROLLER_SENSOR_ACTIVATE_PAGE, () => {
      setControllerPage(ControllerPage.SENSOR_ACTIVATE);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_MOTION_SETTING_PAGE, () => {
      setControllerPage(ControllerPage.MOTION_SETTING);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_LEFT_SETTING_PAGE, () => {
      setControllerPage(ControllerPage.TURN_LEFT);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_RIGHT_SETTING_PAGE, () => {
      setControllerPage(ControllerPage.TURN_RIGHT);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_FORWARD_SETTING_PAGE, () => {
      setControllerPage(ControllerPage.HEAD_FORWARD);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_SETTING_FINISH_PAGE, () => {
      setControllerPage(ControllerPage.SETTING_FINISH);
      sensorDeactivate();
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_DEFAULT_PAGE, () => {
      setControllerPage(ControllerPage.DEFAULT);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_CONNECTION_SUCCESS_PAGE, () => {
      setControllerPage(ControllerPage.CONNECTION_SUCCESS);
    });

    socket.on(SocketEvent.LOAD_CONTROLLER_GAME_PAGE, () => {
      setControllerPage(ControllerPage.GAME);
      sensorActivate();
    });

    socket.on(SocketEvent.RECEIVE_GAME_ID, (gameId) => {
      sendControllerJoinGame(gameId);
    });

    socket.on(SocketEvent.RECEIVE_PADDLE_VIBRATION, () => {
      window.navigator.vibrate([200]);
    });

    socket.on(SocketEvent.RECEIVE_WIN_VIBRATION, () => {
      window.navigator.vibrate([200, 10, 200]);
    });

    socket.on(SocketEvent.RECEIVE_LOSE_VIBRATION, () => {
      window.navigator.vibrate([700]);
    });

    socket.on(
      SocketEvent.RECEIVE_MOTION_CHANGING_MODE_STATE,
      (isModeActivated) => {
        if (isModeActivated) {
          sensorActivate();
        } else {
          sensorDeactivate();
        }

        setIsMotionChangingMode(isModeActivated);
      },
    );

    return () => {
      socket.off(SocketEvent.LOAD_CONTROLLER_SENSOR_ACTIVATE_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_MOTION_SETTING_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_LEFT_SETTING_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_RIGHT_SETTING_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_FORWARD_SETTING_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_SETTING_FINISH_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_DEFAULT_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_CONNECTION_SUCCESS_PAGE);
      socket.off(SocketEvent.LOAD_CONTROLLER_GAME_PAGE);
      socket.off(SocketEvent.RECEIVE_GAME_ID);
      socket.off(SocketEvent.RECEIVE_PADDLE_VIBRATION);
      socket.off(SocketEvent.RECEIVE_WIN_VIBRATION);
      socket.off(SocketEvent.RECEIVE_LOSE_VIBRATION);
      socket.off(SocketEvent.RECEIVE_MOTION_CHANGING_MODE_STATE);
    };
  }, [params.userId, sensorActivate, sensorDeactivate]);

  const handleStartActivation = () => {
    sensorActivate();
  };

  const handleStartMotionSetting = () => {
    sensorActivate();
    startMotionSetting();
  };

  const handleBetaValueSetting = () => {
    sendSensorData({ type: controllerPage, value: beta });
  };

  const handleExitActivation = () => {
    sendExit();
    disconnectController();
    setControllerPage(ControllerPage.DEFAULT);
  };

  const handleExitSetting = () => {
    sendExit();
    setControllerPage(ControllerPage.DEFAULT);
  };

  const handleEnterMotionSettingPage = () => {
    switchMotionSettingPage();
    setControllerPage(ControllerPage.MOTION_SETTING);
  };

  const handleExitGame = () => {
    requestExitGame();
    setControllerPage(ControllerPage.DEFAULT);
  };

  const handleDetectMotion = () => {
    setIsDetectingMotion(true);
  };

  const handleStopDetectMotion = () => {
    setIsDetectingMotion(false);
    sendStopDetectMotion();
  };

  controllerPage === ControllerPage.GAME && sensorValueEmitter(beta);
  controllerPage === ControllerPage.DEFAULT && deviceMotionEmitter(alpha, beta);

  return (
    <ControllerWrap>
      {controllerPage === ControllerPage.DEFAULT && (
        <>
          <div className="header">모바일 컨트롤러</div>
          {isMotionChangingMode && (
            <>
              {isDetectingMotion ? (
                <button onClick={handleStopDetectMotion}>
                  모션감지 멈추기
                </button>
              ) : (
                <button onClick={handleDetectMotion}>모션감지 활성화</button>
              )}
            </>
          )}
        </>
      )}
      {controllerPage === ControllerPage.SENSOR_ACTIVATE && (
        <>
          <div className="header">활성화 버튼을 눌러주세요</div>
          <button type="button" onClick={handleStartActivation}>
            자이로 센서 활성화
          </button>
          <button type="button" onClick={handleExitActivation}>
            나가기
          </button>
        </>
      )}
      {controllerPage === ControllerPage.CONNECTION_SUCCESS && (
        <>
          <div className="header">연결에 성공하였습니다.</div>
          <button type="button" onClick={handleEnterMotionSettingPage}>
            움직임 범위 설정하기
          </button>
          <button type="button" onClick={handleExitSetting}>
            나가기
          </button>
        </>
      )}
      {controllerPage === ControllerPage.MOTION_SETTING && (
        <>
          <div className="header">시작하기 버튼을 눌러주세요</div>
          <button type="button" onClick={handleStartMotionSetting}>
            측정 시작하기
          </button>
          <button type="button" onClick={handleExitSetting}>
            나가기
          </button>
        </>
      )}
      {controllerPage === ControllerPage.TURN_LEFT && (
        <>
          <div className="header">기기를 왼쪽으로 기울여주세요</div>
          <button type="button" onClick={handleBetaValueSetting}>
            확인
          </button>
        </>
      )}
      {controllerPage === ControllerPage.TURN_RIGHT && (
        <>
          <div className="header">기기를 오른쪽으로 기울여주세요</div>
          <button type="button" onClick={handleBetaValueSetting}>
            확인
          </button>
        </>
      )}
      {controllerPage === ControllerPage.SETTING_FINISH && (
        <>
          <div className="header">세팅이 완료되었습니다</div>
          <button type="button" onClick={handleExitSetting}>
            나가기
          </button>
        </>
      )}
      {controllerPage === ControllerPage.GAME && (
        <>
          <div className="header">게임 중입니다</div>
          <button type="button" onClick={handleExitGame}>
            게임 그만두기
          </button>
        </>
      )}
    </ControllerWrap>
  );
}

const ControllerWrap = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100vw;
  height: 100vh;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 20%;
    font-size: 40px;
  }

  button {
    padding: 30px 30px;
    font-size: 30px;
  }
`;
