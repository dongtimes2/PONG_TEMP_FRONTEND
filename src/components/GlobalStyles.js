import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyles = createGlobalStyle`
  ${reset}

  @font-face {
  font-family: 'DungGeunMo';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  }

  body {
    background-color: black;
    color: #00ff2b;
    font-family: 'DungGeunMo';
    user-select: none;
    overflow: hidden;
  }

  button {
    color: #00ff2b;
    background-color: transparent;
    border: 1px solid #00ff2b;
    font-family: 'DungGeunMo';
    cursor: pointer;
  }

  button:hover {
    color: black;
    background-color: #00ff2b;
  }

  button:active {
    background-color: black;
    color: #00ff2b;
  }

  a {
    color: #00ff2b;
    text-decoration: none;
    border: 1px solid #00ff2b;
  }

  a:hover {
    color: black;
    background-color: #00ff2b;
  }

  a:active {
    background-color: black;
    color: #00ff2b;
  }
`;

export default GlobalStyles;
