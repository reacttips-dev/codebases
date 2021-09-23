import React from 'react';

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const VideoPlayerIcon = ({ fillColor, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="14"
    viewBox="0 0 18 14"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M1 0h16a1 1 0 0 1 1 1v11.76a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1zm6.44 4.17v5.1a.5.5 0 0 0 .8.4l3.5-2.55a.5.5 0 0 0 0-.81l-3.5-2.55a.5.5 0 0 0-.8.4z"
    />
  </svg>
);

VideoPlayerIcon.defaultProps = defaultProps;

export { VideoPlayerIcon };
