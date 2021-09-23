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

const InfoIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    className={className}
  >
    <title>Info icon</title>
    <g fill={fillColor} fillRule="nonzero">
      <path d="M10.26 14.86H7.74V6.7h2.54v8.16zM8.98 5.7c-.8 0-1.34-.56-1.32-1.26-.02-.74.52-1.28 1.34-1.28.82 0 1.34.56 1.36 1.28 0 .68-.54 1.26-1.38 1.26z" />
    </g>
  </svg>
);

InfoIcon.defaultProps = defaultProps;

export default InfoIcon;
