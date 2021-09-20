/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import { BoardIcon } from '@trello/nachos/icons/board';
import React, { useCallback } from 'react';
import Media from 'react-media';

import { HeaderTestIds } from '@trello/test-ids';
import { ScreenBreakpoints } from 'app/src/components/Responsive';
import { forTemplate } from '@trello/i18n';

import HeaderButton from './button';
import styles from './header.less';
import { Analytics } from '@trello/atlassian-analytics';
import {
  useBoardsMenuVisibility,
  BoardsMenuVisibilityState,
} from 'app/src/components/BoardsMenuVisibility';

const format = forTemplate('boards_sidebar');
const formatHeaderUser = forTemplate('header_user');

const HeaderBoardMenuButton: React.FunctionComponent = () => {
  const {
    boardsMenuVisibility,
    setBoardsMenuVisibility,
  } = useBoardsMenuVisibility();

  const onHeaderButtonClick = useCallback(
    (event) => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'boardsMenuButton',
        source: 'appHeader',
      });

      if (boardsMenuVisibility === BoardsMenuVisibilityState.CLOSED) {
        setBoardsMenuVisibility(BoardsMenuVisibilityState.POPOVER);
        Analytics.sendScreenEvent({
          name: 'boardsMenuInlineDialog',
        });
        // If we don't stopPropagation here, the event will bubble to the document, where an event handler is registered
        // by the <BoardsMenu /> component to detect if we're clicking outside the menu. Given that the button is not
        // within the menu, it would be detected as an "outside" click and cause the boards menu popover to immediately
        // close.
        event.stopPropagation();
      }
    },
    [boardsMenuVisibility, setBoardsMenuVisibility],
  );

  return (
    <HeaderButton
      icon={<BoardIcon color="light" />}
      onClick={onHeaderButtonClick}
      testId={HeaderTestIds.BoardsMenuButton}
      ariaLabel={formatHeaderUser('boards-menu')}
    >
      <Media query={ScreenBreakpoints.MediumMin}>
        {(matches: boolean) => (
          <span
            className={classNames(
              styles.boardsButtonText,
              !matches && styles.boardsButtonTextCollapsed,
            )}
          >
            {format('boards')}
          </span>
        )}
      </Media>
    </HeaderButton>
  );
};

export default HeaderBoardMenuButton;
