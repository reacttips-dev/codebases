import React, { FunctionComponent, MouseEventHandler } from 'react';
import classNames from 'classnames';
import styles from './boards-menu.less';
import { TestId } from '@trello/test-ids';
import { Button } from '@trello/nachos/button';

interface BoardsMenuButtonProps {
  onClick: MouseEventHandler;
  className?: string;
  testId?: TestId;
}

export const BoardsMenuButton: FunctionComponent<BoardsMenuButtonProps> = ({
  onClick,
  className,
  testId,
  children,
}) => {
  return (
    <Button
      appearance="subtle-link"
      size="fullwidth"
      onClick={onClick}
      className={classNames(styles.menuButton, className)}
      data-test-id={testId}
    >
      {children}
    </Button>
  );
};
