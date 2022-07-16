import { atom } from 'recoil';

const settingState = atom({
  key: 'setting',
  default: {
    isVibrationMode: false,
    isPlayingMusic: false,
    isPlayingSFX: false,
    isChangedPageByMotion: false,
    isCheckingCompatibility: false,
    isCompatible: false,
    isCompletedMotionSettings: false,
    left: 0,
    right: 0,
  },
});

export default settingState;
