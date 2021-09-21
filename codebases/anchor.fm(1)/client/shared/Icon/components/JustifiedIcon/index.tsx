import React from 'react';
import { default as JustifiedCenterIcon } from './components/JustifiedCenterIcon';
import { default as JustifiedLeftIcon } from './components/JustifiedLeftIcon';
import { default as JustifiedRightIcon } from './components/JustifiedRightIcon';

type FillColor = string;
type ClassName = string;
type JustifiedType = 'center' | 'left' | 'right';

interface Props {
  type: JustifiedType;
  fillColor: FillColor;
  className: ClassName;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
  type: 'center',
};

const getJustifiedIconForType = (
  justifiedType: JustifiedType,
  svgClassName: ClassName,
  fillColor: FillColor
): React.ReactElement<React.ReactNode> => {
  switch (justifiedType) {
    case 'center':
      return (
        <JustifiedCenterIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'right':
      return (
        <JustifiedRightIcon className={svgClassName} fillColor={fillColor} />
      );
    case 'left':
      return (
        <JustifiedLeftIcon className={svgClassName} fillColor={fillColor} />
      );
    default:
      const exhaustiveCheck: never = justifiedType;
      return exhaustiveCheck;
  }
};

const JustifiedIcon = ({
  type,
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> =>
  getJustifiedIconForType(type, className, fillColor);

JustifiedIcon.defaultProps = defaultProps;

export default JustifiedIcon;
