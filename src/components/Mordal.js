import PropTypes from 'prop-types';
import styled from 'styled-components';

const Modal = ({ onClose, children }) => {
  const handleCloseAreaClick = () => {
    onClose(false);
  };

  const handleBoxClick = (event) => {
    event.stopPropagation();
  };

  return (
    <BackGround onClick={handleCloseAreaClick}>
      <Box onClick={handleBoxClick}>{children}</Box>
    </BackGround>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

const BackGround = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
`;

const Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  width: 80%;
  height: 70%;
  padding: 30px;
  border: 5px solid #00ff2b;
`;

export default Modal;
