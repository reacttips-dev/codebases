import React from 'react';
import cx from 'classnames';
import { N40A } from '@trello/colors';
import { Board } from './Board';
import styles from './BoardCard.less';

export const PlaceholderCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <Board className={cx(className, styles.placeholderBoard)} bgColor={N40A}>
    <div className={cx(styles.placeholderBar, styles.topPlaceholderBar)} />
    <div className={cx(styles.placeholderBar, styles.bottomPlaceholderBar)} />
  </Board>
);
