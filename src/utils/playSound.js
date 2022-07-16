import click from '../audios/click.mp3';
import extinction from '../audios/extinction.mp3';
import lose from '../audios/lose.mp3';
import music1 from '../audios/music1.mp3';
import paddleHit from '../audios/paddle_hit.mp3';
import wallHit from '../audios/wall_hit.mp3';
import win from '../audios/win.mp3';

const clickSound = new Audio(click);
const extinctionSound = new Audio(extinction);
const paddleHitSound = new Audio(paddleHit);
const wallHitSound = new Audio(wallHit);
const winSound = new Audio(win);
const loseSound = new Audio(lose);
const bgm = new Audio(music1);

export const playClickSound = () => {
  clickSound.play();
};

export const playExtinctionSound = () => {
  extinctionSound.play();
};

export const playPaddleHitSound = () => {
  paddleHitSound.play();
};

export const playWallHitSound = () => {
  wallHitSound.play();
};

export const playWinSound = () => {
  winSound.play();
};

export const playloseSound = () => {
  loseSound.play();
};

export const musicController = (toggle) => {
  if (toggle) {
    bgm.play();
    bgm.onended = function () {
      this.currentTime = 0;
      this.play();
    };
  } else {
    bgm.pause();
    bgm.currentTime = 0;
  }
};
