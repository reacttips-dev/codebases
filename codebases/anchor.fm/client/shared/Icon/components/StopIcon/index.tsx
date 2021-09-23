import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const StopIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    className={className}
  >
    <rect
      width="10"
      height="10"
      x="357"
      y="565"
      fill={fillColor}
      fillRule="nonzero"
      rx=".5"
      transform="translate(-357 -565)"
    />
  </svg>
);

StopIcon.defaultProps = defaultProps;

export { StopIcon };
