import { atom } from 'recoil';

const userState = atom({
  key: 'user',
  default: {
    id: '',
    controllerId: '',
  },
});

export default userState;
