import React, { CSSProperties } from 'react';
import cx from 'classnames';
import styles from './Board.less';
import {
  N0,
  N800,
  TrelloBlue500,
  makeRGBA,
  useLightText,
} from '@trello/colors';

export interface BoardProps {
  bgColor?: string;
  bgImage?: string | null;
  borderColor?: string;
  className?: string;
  hasError?: boolean;
  headerBgColor?: string | null;
  loading?: boolean;
  numLists?: number;
  title?: string;
  widthPx?: number;
  style?: CSSProperties;
  gradientLocation?: 'top' | 'bottom';
}

export const Board: React.FC<BoardProps> = ({
  bgColor,
  bgImage,
  borderColor,
  hasError,
  headerBgColor,
  children,
  className,
  loading,
  numLists = 5,
  widthPx,
  style = {},
  gradientLocation = 'top',
}) => {
  // Apply base classes
  const boardClasses = cx(
    styles.board,
    className,
    hasError && styles.boardError,
    loading && styles.boardLoading,
  );

  // Set custom background color
  const dynamicStyles: CSSProperties = { ...style };
  if (bgColor) {
    dynamicStyles.backgroundColor = bgColor;
  }

  // Set custom background image
  if (bgImage && !headerBgColor) {
    dynamicStyles.backgroundImage = `url(${bgImage})`;
    dynamicStyles.backgroundSize = 'cover';
    dynamicStyles.backgroundPosition = 'bottom';
  } else if (headerBgColor) {
    const headerColor = makeRGBA(headerBgColor, 0.7);
    const headerBg = `linear-gradient(0deg, ${headerColor} 50%, ${headerColor} 0%)`;
    dynamicStyles.backgroundSize = `100% 64px, cover`;

    if (gradientLocation === 'bottom') {
      dynamicStyles.backgroundPosition = 'bottom';
    }

    dynamicStyles.backgroundImage = `${headerBg}, url(${bgImage})`;
  }

  // Set text color based on background color
  const color = headerBgColor || bgColor || TrelloBlue500;
  dynamicStyles.color = useLightText(color) && !hasError ? N0 : N800;

  // Set dynamic width based on number of lists
  if (numLists !== 5) {
    dynamicStyles.width = `${numLists * 48 + 8}px`;
  }

  // Set custom border color
  if (borderColor) {
    dynamicStyles.border = `1px solid ${borderColor}`;
  }

  if (widthPx) {
    dynamicStyles.width = `${widthPx}px`;
  }

  return (
    <div className={boardClasses} style={dynamicStyles}>
      {children}
    </div>
  );
};

export const BoardLists: React.FC = ({ children }) => (
  <div className={styles.boardLists}>{children}</div>
);

export const TeamName: React.FC = ({ children }) => (
  <h2 className={styles.teamName}>{children}</h2>
);

export const BoardName: React.FC<{ className?: string }> = ({
  children,
  className,
}) => <h1 className={cx(styles.boardName, className)}>{children}</h1>;

export const ErrorMessage: React.FC = ({ children }) => (
  <h1 className={cx(styles.boardName, styles.errorMessage)}>{children}</h1>
);
