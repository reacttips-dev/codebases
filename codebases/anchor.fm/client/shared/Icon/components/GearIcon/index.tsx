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

const GearIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className={className}
  >
    <title>settings</title>
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M6.48 0L6.1 2c-.35.11-.7.25-1.01.42L3.42 1.27 1.26 3.42 2.42 5.1c-.17.32-.3.66-.42 1.01l-2 .37v3.04l2 .37c.11.35.26.69.43 1.01l-1.17 1.68 2.16 2.15 1.67-1.15c.32.17.67.3 1.02.42l.37 2h3.04l.37-2c.35-.11.7-.25 1.01-.42l1.68 1.15 2.15-2.15-1.16-1.68c.17-.32.31-.65.42-1L16 9.51V6.48l-2-.37a6.24 6.24 0 0 0-.42-1l1.15-1.69-2.15-2.15-1.68 1.15A6.24 6.24 0 0 0 9.9 2l-.37-2H6.48zM8 4.57a3.43 3.43 0 1 1 0 6.86 3.43 3.43 0 0 1 0-6.86z"
    />
  </svg>
);

GearIcon.defaultProps = defaultProps;

export { GearIcon };
