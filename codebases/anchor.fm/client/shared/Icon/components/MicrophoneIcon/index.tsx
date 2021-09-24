import React from 'react';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const MicrophoneIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fill={fillColor}
      d="M256,353.5c43.7,0,79-37.5,79-83.5V115.5c0-46-35.3-83.5-79-83.5c-43.7,0-79,37.5-79,83.5V270 C177,316,212.3,353.5,256,353.5z"
    />
    <path
      fill={fillColor}
      d="M367,192v79.7c0,60.2-49.8,109.2-110,109.2c-60.2,0-110-49-110-109.2V192h-19v79.7c0,67.2,53,122.6,120,127.5V462h-73v18 h161v-18h-69v-62.8c66-4.9,117-60.3,117-127.5V192H367z"
    />
  </svg>
);

MicrophoneIcon.defaultProps = defaultProps;

export default MicrophoneIcon;
