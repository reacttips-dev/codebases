import React from 'react';

type FillColor = string;
type ClassName = string;

interface IProps {
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const ErrorIcon = ({
  fillColor = '#53585E',
  className = '',
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 35 30"
    className={className}
  >
    <path
      fill={fillColor}
      fillRule="nonzero"
      d="M34.55 26.97L19.34 1.27c-1.01-1.71-2.67-1.69-3.68.03L.45 26.96C-.56 28.68.19 30 2.13 30h30.74c1.94 0 2.7-1.31 1.68-3.03zm-17.06-20c.97 0 1.73 1.1 1.68 2.47l-.31 8.21c-.05 1.37-.67 2.48-1.38 2.48-.7 0-1.32-1.11-1.37-2.48l-.3-8.21c-.06-1.36.7-2.48 1.68-2.48zm0 19.35c-1.23 0-2.07-.93-2.05-2.2 0-1.3.85-2.21 2.05-2.21 1.25 0 2.04.9 2.07 2.2 0 1.28-.82 2.2-2.07 2.2z"
    />
  </svg>
);

ErrorIcon.defaultProps = defaultProps;

export { ErrorIcon };
