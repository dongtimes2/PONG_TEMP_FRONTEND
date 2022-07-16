import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';

const Qrcode = ({ link, size }) => {
  return (
    <QRCodeSVG
      value={link}
      size={size}
      bgColor={'#000000'}
      fgColor={'#00ff2b'}
    />
  );
};

Qrcode.propTypes = {
  link: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Qrcode;
