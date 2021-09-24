import React from 'react';
import { ArrowLeftIcon } from './components/ArrowLeftIcon/index';

type ArrowDirection = 'left';
type FillColor = string;
type ClassName = string;

interface Props {
  direction: ArrowDirection;
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  direction: 'left',
  fillColor: '#53585E',
  className: '',
};

const getArrowIconForDirection = (
  direction: ArrowDirection,
  svgClassName: ClassName,
  fillColor: FillColor
) => {
  switch (direction) {
    case 'left':
      return <ArrowLeftIcon className={svgClassName} fillColor={fillColor} />;
    default:
      const exhaustiveCheck: never = direction;
      return exhaustiveCheck;
  }
};

const ArrowIcon = ({
  direction,
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> =>
  getArrowIconForDirection(direction, className, fillColor);

ArrowIcon.defaultProps = defaultProps;

export default ArrowIcon;
