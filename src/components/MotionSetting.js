import { useEffect, useState } from 'react';

import { useRecoilValue, useRecoilState } from 'recoil';
import styled from 'styled-components';

import { MotionSettingPage } from '../constants/page';
import SocketEvent from '../constants/socket';
import settingState from '../recoil/settingState';
import userState from '../recoil/userState';
import { enterControllerMotionSerringPage, socket } from '../utils/socketAPI';

const MotionSetting = () => {
  const user = useRecoilValue(userState);
  const [setting, setSetting] = useRecoilState(settingState);
  const [currentPage, setCurrentPage] = useState(MotionSettingPage.INITIAL);

  useEffect(() => {
    enterControllerMotionSerringPage(user.controllerId);

    socket.on(SocketEvent.RECEIVE_MOTION_SETTING_BEGIN, () => {
      setCurrentPage(MotionSettingPage.TURN_LEFT);
    });

    socket.on(SocketEvent.RECEIVE_LEFT_DATA, (leftData) => {
      setSetting((prev) => {
        return { ...prev, left: leftData, isCompletedMotionSettings: false };
      });
      setCurrentPage(MotionSettingPage.TURN_RIGHT);
    });

    socket.on(SocketEvent.RECEIVE_RIGHT_DATA, (rightData) => {
      setSetting((prev) => {
        return { ...prev, right: rightData, isCompletedMotionSettings: true };
      });
      setCurrentPage(MotionSettingPage.FINISH);
    });

    return () => {
      socket.off(SocketEvent.RECEIVE_MOTION_SETTING_BEGIN);
      socket.off(SocketEvent.RECEIVE_LEFT_DATA);
      socket.off(SocketEvent.RECEIVE_RIGHT_DATA);
    };
  }, [user.controllerId, setSetting]);

  return (
    <MotionSettingWrap>
      {currentPage === MotionSettingPage.INITIAL && (
        <>
          <div className="header-area">
            <div>기기의 상단이 왼쪽으로 가게끔 가로로 잡아주세요.</div>
            <div>그 다음 측정 시작하기 버튼을 눌러주세요.</div>
          </div>

          {setting.isCompletedMotionSettings && (
            <div className="sub-area">
              <div>현재 세팅된 값은 다음과 같습니다.</div>
              <div>
                좌: {setting.left} 우: {setting.right}
              </div>
            </div>
          )}
        </>
      )}

      {currentPage === MotionSettingPage.TURN_LEFT && (
        <div className="header-area">
          <div>기기를 편한 각도까지 왼쪽으로 기울여주세요.</div>
          <div>그 다음 확인 버튼을 눌러주세요.</div>
        </div>
      )}

      {currentPage === MotionSettingPage.TURN_RIGHT && (
        <div className="header-area">
          <div>기기를 편한 각도까지 오른쪽으로 기울여주세요.</div>
          <div>그 다음 확인 버튼을 눌러주세요.</div>
        </div>
      )}

      {currentPage === MotionSettingPage.FINISH && (
        <>
          <div className="header-area">
            <div>측정이 종료되었습니다.</div>
          </div>
          <div className="result-area">
            <div>측정 결과</div>
            <div>
              좌: {setting.left} 우: {setting.right}
            </div>
          </div>
        </>
      )}
    </MotionSettingWrap>
  );
};

const MotionSettingWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 50px;

  .header-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-basis: 30%;
  }

  .sub-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.8em;
  }

  .result-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-basis: 70%;
  }
`;

export default MotionSetting;
