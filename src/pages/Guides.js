import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import SocketEvent from '../constants/socket';
import settingState from '../recoil/settingState';
import { playClickSound } from '../utils/playSound';
import { socket } from '../utils/socketAPI';

export default function Guide() {
  const [motionValueList, setMotionValueList] = useState([]);
  const setting = useRecoilValue(settingState);

  const navigate = useNavigate();

  const handleButtonSound = (event) => {
    if (event.target.nodeName === 'A' && setting.isPlayingSFX) {
      playClickSound();
    }
  };

  useEffect(() => {
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

    return () => {
      socket.off(SocketEvent.RECEIVE_MOVE_UP);
      socket.off(SocketEvent.RECEIVE_MOVE_DOWN);
      socket.off(SocketEvent.RECEIVE_MOVE_LEFT);
      socket.off(SocketEvent.RECEIVE_MOVE_RIGHT);
      socket.off(SocketEvent.RECEIVE_STOP_DETECT_MOTION);
    };
  }, []);

  useEffect(() => {
    if (motionValueList[0] === '🡹' && motionValueList[1] === '🡸') {
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else if (motionValueList.length >= 2) {
      setMotionValueList([]);
    }
  }, [motionValueList, navigate]);

  return (
    <GuidesWrap onClick={handleButtonSound}>
      <div className="title-area">| Guides |</div>
      <div className="content-area">
        <>
          <div className="question">○ PONG은 어떤 게임인가요?</div>
          <div className="answer">
            &nbsp; PONG은 상업적으로 성공한 역사상 최초의 아케이드 게임입니다.
          </div>
        </>
        <>
          <div className="question"> ○ 어떻게 플레이하면 되나요?</div>
          <div className="answer">
            &nbsp; 나에게 날아오는 공을 튕겨 상대방에게 보내야 합니다. <br />
            &nbsp; 공을 튕기지 못해, 벽에 닿은 경우 점수를 잃습니다. <br />
            &nbsp; 반대로 상대방이 공을 튕기지 못한 경우 점수를 얻습니다.
          </div>
        </>
        <>
          <div className="question">○ 게임을 하기 위한 조건이 있나요?</div>
          <div className="answer">
            &nbsp; 자이로센서가 탑재되어있는 모바일 기기가 추가적으로
            필요합니다.
          </div>
        </>
      </div>
      <div className="button-area">
        <Link to="/">
          {setting.isChangedPageByMotion && <span>&#129145; &#129144;</span>}{' '}
          메인 화면으로 돌아가기
        </Link>
      </div>
      {setting.isChangedPageByMotion && (
        <>
          <div className="motion-value-area">{motionValueList}</div>
        </>
      )}
    </GuidesWrap>
  );
}

const GuidesWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  .title-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 15%;
    font-size: 100px;
    white-space: nowrap;
  }

  .content-area {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-basis: 60%;
  }

  .button-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: 20%;
  }

  .motion-value-area {
    display: flex;
    align-items: center;
    flex-basis: 5%;
    font-size: 30px;
  }

  .question {
    font-size: 50px;
  }

  .answer {
    font-size: 30px;
  }

  a {
    padding: 20px 50px;
    font-size: 30px;
  }
`;
