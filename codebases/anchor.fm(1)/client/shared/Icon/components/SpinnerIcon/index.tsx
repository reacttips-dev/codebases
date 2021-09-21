import React from 'react';

import styles from './styles.sass';

interface IProps {
  className: string;
  fillColor: string;
}

const SpinnerIcon = ({
  className,
  fillColor,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`${styles.spinner} ${className}`}
    viewBox="0 0 37 37"
  >
    <g
      fill="none"
      fillRule="evenodd"
      strokeWidth="3.56"
      transform="translate(2 2)"
    >
      <circle cx="16.49" cy="16.49" r="16.49" stroke="#C9CBCD" />
      <path
        stroke={fillColor}
        d="M16.04 0c5.21 0 9.52 1.91 12.9 5.73 3.4 3.83 4.56 8.86 3.51 15.09"
      />
    </g>
  </svg>
);

SpinnerIcon.defaultProps = {
  className: '',
  fillColor: '#5000b9',
};

export { SpinnerIcon };
