import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import CreateGame from '../components/CreateGame';
import ModalPortal from '../components/ModalPortal';
import Modal from '../components/Mordal';
import SocketEvent from '../constants/socket';
import settingState from '../recoil/settingState';
import { playClickSound } from '../utils/playSound';
import { requestGameList, socket } from '../utils/socketAPI';

export default function Lobby() {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [gameList, setGameLIst] = useState([]);
  const [motionValueList, setMotionValueList] = useState([]);
  const setting = useRecoilValue(settingState);

  const navigate = useNavigate();

  useEffect(() => {
    requestGameList();

    const gameListSetter = (data) => {
      setGameLIst([...data]);
    };

    socket.on(SocketEvent.RECEIVE_GAME_ROOM_LIST, gameListSetter);

    return () => {
      socket.off(SocketEvent.RECEIVE_GAME_ROOM_LIST, gameListSetter);
    };
  }, []);

  useEffect(() => {
    if (!isShowingModal) {
      socket.on(SocketEvent.RECEIVE_MOVE_UP, () => {
        setMotionValueList((prev) => [...prev, '🡹']);
      });

      socket.on(SocketEvent.RECEIVE_MOVE_DOWN, () => {
        setMotionValueList((prev) => [...prev, '🡻']);
      });

      socket.on(SocketEvent.RECEIVE_MOVE_LEFT, () => {
        setMotionValueList((prev) => [...prev, '🡸']);
      });

      socket.on(SocketEvent.RECEIVE_MOVE_RIGHT, () => {
        setMotionValueList((prev) => [...prev, '🡺']);
      });

      socket.on(SocketEvent.RECEIVE_STOP_DETECT_MOTION, () => {
        setMotionValueList([]);
      });
    }

    return () => {
      socket.off(SocketEvent.RECEIVE_MOVE_UP);
      socket.off(SocketEvent.RECEIVE_MOVE_DOWN);
      socket.off(SocketEvent.RECEIVE_MOVE_LEFT);
      socket.off(SocketEvent.RECEIVE_MOVE_RIGHT);
      socket.off(SocketEvent.RECEIVE_STOP_DETECT_MOTION);
    };
  }, [isShowingModal]);

  useEffect(() => {
    if (motionValueList[0] === '🡸' && motionValueList[1] === '🡺') {
      setTimeout(() => {
        handleShowModal();
        setMotionValueList([]);
      }, 500);
    } else if (motionValueList[0] === '🡹' && motionValueList[1] === '🡸') {
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else if (motionValueList.length >= 2) {
      setMotionValueList([]);
    }
  }, [motionValueList, navigate]);

  const handleShowModal = () => {
    setIsShowingModal(true);
  };

  const handleCloseModal = () => {
    if (setting.isPlayingSFX) {
      playClickSound();
    }

    setIsShowingModal(false);
  };

  const handleEnterGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleButtonSound = (event) => {
    if (
      (event.target.nodeName === 'A' || event.target.nodeName === 'BUTTON') &&
      setting.isPlayingSFX
    ) {
      playClickSound();
    }
  };

  return (
    <>
      <LobbyWrap onClick={handleButtonSound}>
        <div className="title-area">| GAME LIST |</div>
        <div className="room-list-area">
          {gameList.length ? (
            gameList.map((game) => (
              <EntryButton
                key={game.gameId}
                onClick={() => {
                  handleEnterGame(game.gameId);
                }}
                disabled={game.isFull || game.isStarted}
              >
                <div className="order-area">{game.registrationOrder}번 방</div>
                <div className="mode-area">
                  난이도: {game.isNormalMode ? '보통' : '어려움'}
                </div>
                <div className="target-score-area">
                  목표 점수: {game.isNormalTargetScore ? '11점' : '21점'}
                </div>
                <div className="entry-ability-area">
                  {game.isFull || game.isStarted ? '입장 불가' : '입장 가능'}
                </div>
              </EntryButton>
            ))
          ) : (
            <div>생성된 방이 없습니다</div>
          )}
        </div>
        <div className="button-area">
          <button type="button" onClick={handleShowModal}>
            {setting.isChangedPageByMotion && <span>&#129144; &#129146;</span>}{' '}
            게임 생성하기
          </button>
          <Link to="/">
            {setting.isChangedPageByMotion && <span>&#129145; &#129144;</span>}{' '}
            뒤로가기
          </Link>
        </div>
        {setting.isChangedPageByMotion && (
          <>
            <div className="motion-value-area">{motionValueList}</div>
          </>
        )}
      </LobbyWrap>

      {isShowingModal && (
        <ModalPortal>
          <Modal onClose={setIsShowingModal}>
            <ModalContentWrap>
              <CreateGame />
              <div className="button-area">
                <button type="button" onClick={handleCloseModal}>
                  나가기
                </button>
              </div>
            </ModalContentWrap>
          </Modal>
        </ModalPortal>
      )}
    </>
  );
}

const EntryButton = styled.button`
  display: flex;
  width: 80%;
  justify-content: space-evenly;
  border: 1px solid #00ff2b;
  margin: 10px 0px;
  padding: 10px 0;
  font-size: 30px;

  .order-area {
    flex-basis: 25%;
  }

  .mode-area {
    display: flex;
    flex-basis: 25%;
    justify-content: flex-start;
  }

  .target-score-area {
    flex-basis: 25%;
  }

  .entry-ability-area {
    flex-basis: 25%;
  }
`;

const ModalContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  color: #00ff2b;
  width: 100%;
  height: 100%;

  .button-area {
    display: flex;
    justify-content: center;
    flex-basis: 6%;
  }

  .button-area button {
    color: #00ff2b;
    font-size: 40px;
    padding: 0px 50px;
    border: 1px solid #00ff2b;
  }

  .button-area button:hover {
    color: black;
    background-color: #00ff2b;
  }

  .button-area button:active {
    color: #00ff2b;
    background-color: black;
  }
`;

const LobbyWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  .title-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 15%;
    font-size: 100px;
  }

  .room-list-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-basis: 65%;
    overflow: auto;
  }

  .button-area {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-basis: 15%;
  }

  .motion-value-area {
    display: flex;
    justify-content: center;
    flex-basis: 5%;
    font-size: 30px;
  }

  a {
    padding: 20px 50px;
    font-size: 30px;
  }

  .button-area button {
    padding: 20px 50px;
    font-size: 30px;
  }
`;
