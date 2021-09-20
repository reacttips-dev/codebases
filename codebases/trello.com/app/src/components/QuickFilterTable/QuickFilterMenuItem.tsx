import React, { useCallback } from 'react';
import styles from './QuickFilterMenuItem.less';
import { Button } from '@trello/nachos/button';
import { Screen } from './QuickFilterTable';
import { ForwardIcon } from '@trello/nachos/icons/forward';
import { TableTestIds } from '@trello/test-ids';

interface QuickFilterMenuItemProps {
  label: string;
  screen?: Screen;
  onClick?: () => void;
  pushScreen?: (screen: number) => void;
  icon?: JSX.Element;
  showArrow?: boolean;
  testId?: TableTestIds;
}

export const QuickFilterMenuItem: React.FunctionComponent<QuickFilterMenuItemProps> = ({
  label,
  screen,
  onClick,
  pushScreen,
  icon,
  showArrow,
  testId,
}: QuickFilterMenuItemProps) => {
  const onClickItem = useCallback(() => {
    onClick && onClick();
    pushScreen && screen && pushScreen(screen);
  }, [onClick, pushScreen, screen]);

  return (
    <Button
      iconBefore={icon}
      iconAfter={
        showArrow ? (
          <ForwardIcon
            size={'small'}
            dangerous_className={styles.quickFilterMenuButtonForwardIcon}
          ></ForwardIcon>
        ) : undefined
      }
      shouldFitContainer
      className={styles.quickFilterMenuButton}
      testId={testId}
      appearance="subtle"
      onClick={onClickItem}
    >
      {label}
    </Button>
  );
};
