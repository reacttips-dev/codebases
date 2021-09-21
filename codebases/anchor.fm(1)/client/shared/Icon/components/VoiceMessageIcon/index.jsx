import React from 'react';

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const VoiceMessageIcon = ({ fillColor, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 17"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M9.35 7.38V4.84H7.89v2.54H5.45V8.9H7.9v2.54h1.46V8.9H11.78V7.38H9.35zM0 8.13C0 3.64 3.8 0 8.5 0S17 3.64 17 8.13c0 1.95-.7 3.72-1.9 5.11.23.65.62 1.37 1.35 1.9.18.15.12.45-.09.47a4.8 4.8 0 0 1-3.24-.65 8.7 8.7 0 0 1-4.62 1.3c-4.7 0-8.5-3.64-8.5-8.13z"
    />
  </svg>
);

VoiceMessageIcon.defaultProps = defaultProps;

export { VoiceMessageIcon };
