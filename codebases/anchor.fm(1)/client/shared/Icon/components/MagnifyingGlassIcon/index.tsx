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

const MagnifyingGlassIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13.9 13.22l-3.67-3.68a5.8 5.8 0 1 0-.68.68l3.67 3.69c.13.12.33.12.46 0l.23-.23a.32.32 0 0 0 0-.46zM.98 5.8a4.84 4.84 0 1 1 9.67.01A4.84 4.84 0 0 1 .97 5.8z"
      fill={fillColor}
      fillRule="evenodd"
    />
  </svg>
);

MagnifyingGlassIcon.defaultProps = defaultProps;

export default MagnifyingGlassIcon;
