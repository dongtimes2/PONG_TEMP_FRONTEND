export const MotionSettingPage = {
  INITIAL: 'initial',
  TURN_LEFT: 'turnLeft',
  TURN_RIGHT: 'turnRight',
  HEAD_FORWARD: 'headForward',
  FINISH: 'finish',
};

export const ModalContentPage = {
  CONNECTION: 'connection',
  MOTION: 'motion',
};

export const ControllerPage = {
  SENSOR_ACTIVATE: 'sensorActivate',
  MOTION_SETTING: 'motionSetting',
  TURN_LEFT: 'turnLeft',
  TURN_RIGHT: 'turnRight',
  HEAD_FORWARD: 'headForward',
  SETTING_FINISH: 'settingFinish',
  DEFAULT: 'default',
  CONNECTION_SUCCESS: 'connectionSuccess',
  GAME: 'game',
};

Object.freeze(MotionSettingPage);
Object.freeze(ModalContentPage);
Object.freeze(ControllerPage);
