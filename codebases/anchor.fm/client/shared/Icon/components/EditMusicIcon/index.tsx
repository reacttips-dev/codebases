import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const EditMusicIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M16.2 2.54v8.95a4.23 4.23 0 0 0-1.37-.22c-1.75 0-3.17 1.02-3.17 2.27s1.42 2.27 3.17 2.27c1.64 0 3-.9 3.15-2.04L18 1.63V0L5.09 2.5V13.54a4.23 4.23 0 0 0-1.37-.23c-1.76 0-3.17 1.02-3.17 2.27 0 1.26 1.41 2.27 3.17 2.27 1.64 0 3-.9 3.15-2.04l.02-11.47 9.31-1.8z"
    />
  </svg>
);

EditMusicIcon.defaultProps = defaultProps;

export { EditMusicIcon };
