import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import settingState from '../recoil/settingState';
import userState from '../recoil/userState';
import { playClickSound } from '../utils/playSound';
import { createGame } from '../utils/socketAPI';

const CreateGame = () => {
  const [isNormalMode, setIsNormalMode] = useState(true);
  const [isNormalTargetScore, setIsNormalScore] = useState(true);
  const user = useRecoilValue(userState);
  const setting = useRecoilValue(settingState);

  const navigate = useNavigate();

  const handleChangeLevel = () => {
    setIsNormalMode((prev) => !prev);
  };

  const handleChangeTagetScore = () => {
    setIsNormalScore((prev) => !prev);
  };

  const handleCreateGame = () => {
    const gameId = uuidv4();

    createGame({
      registrationOrder: 0,
      gameId,
      hostId: user.id,
      isNormalMode,
      isNormalTargetScore,
      isStarted: false,
      isFull: false,
      userList: [],
      controllerList: [],
      width: Number.MAX_SAFE_INTEGER,
      height: Number.MAX_SAFE_INTEGER,
    });

    navigate(`/game/${gameId}`);
  };

  const handleButtonSound = (event) => {
    if (event.target.nodeName === 'BUTTON' && setting.isPlayingSFX) {
      playClickSound();
    }
  };

  return (
    <CreateGameWrap onClick={handleButtonSound}>
      <div className="title-area">| CREATE GAME |</div>
      <div className="type-area">
        <div className="toggle-button-area">
          <div>난이도</div>
          <button className="status-box" onClick={handleChangeLevel}>
            {isNormalMode ? '보통' : '어려움'}
          </button>
        </div>
        <div className="toggle-button-area">
          <div>목표 점수</div>
          <button className="status-box" onClick={handleChangeTagetScore}>
            {isNormalTargetScore ? '11점' : '21점'}
          </button>
        </div>
      </div>
      <div className="start-button-area">
        <button onClick={handleCreateGame}>게임 생성</button>
      </div>
    </CreateGameWrap>
  );
};

const CreateGameWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .title-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 15%;
    font-size: 70px;
  }

  .type-area {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-basis: 65%;
  }

  .start-button-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 20%;
  }

  .toggle-button-area {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toggle-button-area div {
    display: flex;
    justify-content: center;
    flex-basis: 40%;
    font-size: 60px;
    border-top: 1px solid #00ff2b;
    border-left: 1px solid #00ff2b;
    border-bottom: 1px solid #00ff2b;
    padding: 5px 0;
  }

  .toggle-button-area button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-basis: 60%;
    font-size: 60px;
    padding: 5px 0;
  }

  .start-button-area button {
    font-size: 40px;
    padding: 5px 60px;
  }
`;

export default CreateGame;
