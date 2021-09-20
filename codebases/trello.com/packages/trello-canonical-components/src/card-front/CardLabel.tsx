import React from 'react';
import cx from 'classnames';
import styles from './CardLabel.less';

export type LabelColor =
  | 'black'
  | 'blue'
  | 'green'
  | 'lime'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'sky'
  | 'yellow'
  | 'gray'
  | 'none';

type LabelPattern =
  | 'StripeDiagonal'
  | 'WaveSquare'
  | 'StripeVertical'
  | 'DotsChecker'
  | 'GrooveDiagonal'
  | 'StripeHorizontal'
  | 'BrickDiagonal'
  | 'Scale'
  | 'BrickHorizontal'
  | 'BrickVertical'
  | 'none';

interface CardLabelProps {
  className?: string;
  color?: LabelColor | null;
  pattern?: LabelPattern | null;
  dataTestClass?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

export const labelColorToColorBlindPattern: {
  [key in LabelColor]:
    | 'StripeDiagonal'
    | 'WaveSquare'
    | 'StripeVertical'
    | 'DotsChecker'
    | 'GrooveDiagonal'
    | 'StripeHorizontal'
    | 'BrickDiagonal'
    | 'Scale'
    | 'BrickHorizontal'
    | 'BrickVertical'
    | 'none';
} = {
  black: 'BrickVertical',
  blue: 'StripeHorizontal',
  green: 'StripeDiagonal',
  lime: 'Scale',
  orange: 'StripeVertical',
  pink: 'BrickHorizontal',
  purple: 'GrooveDiagonal',
  red: 'DotsChecker',
  sky: 'BrickDiagonal',
  yellow: 'WaveSquare',
  gray: 'none',
  none: 'none',
};

export const CardLabel: React.FC<CardLabelProps> = ({
  className,
  color,
  pattern,
  dataTestClass,
  children,
  onClick,
  title,
}) => {
  const labelClasses = cx(
    className,
    styles.label,
    children && styles.expanded,
    color === 'blue' && styles.blue,
    color === 'green' && styles.green,
    color === 'lime' && styles.lime,
    color === 'sky' && styles.sky,
    color === 'orange' && styles.orange,
    color === 'pink' && styles.pink,
    color === 'purple' && styles.purple,
    color === 'red' && styles.red,
    color === 'yellow' && styles.yellow,
    color === 'black' && styles.black,
    color === 'gray' && styles.gray,

    pattern === 'StripeDiagonal' && styles.StripeDiagonal,
    pattern === 'WaveSquare' && styles.WaveSquare,
    pattern === 'StripeVertical' && styles.StripeVertical,
    pattern === 'DotsChecker' && styles.DotsChecker,
    pattern === 'GrooveDiagonal' && styles.GrooveDiagonal,
    pattern === 'StripeHorizontal' && styles.StripeHorizontal,
    pattern === 'BrickDiagonal' && styles.BrickDiagonal,
    pattern === 'Scale' && styles.Scale,
    pattern === 'BrickHorizontal' && styles.BrickHorizontal,
    pattern === 'BrickVertical' && styles.BrickVertical,
  );
  return (
    <span
      className={labelClasses}
      data-test-class={dataTestClass}
      onClick={onClick}
      role={onClick && 'button'}
      title={title}
    >
      {children}
    </span>
  );
};
