import React from 'react';
import classNames from 'classnames';
import styles from './Surface.less';
import {
  useBoardsMenuVisibility,
  BoardsMenuVisibilityState,
} from 'app/src/components/BoardsMenuVisibility';
import { useWorkspaceNavigation } from 'app/src/components/WorkspaceNavigation';

export const Surface: React.FunctionComponent = ({ children }) => {
  const { boardsMenuVisibility } = useBoardsMenuVisibility();
  const [{ enabled: workspaceNavigationEnabled }] = useWorkspaceNavigation();

  return (
    <div
      id="surface"
      className={classNames(
        styles.surface,
        boardsMenuVisibility === BoardsMenuVisibilityState.PINNED &&
          !workspaceNavigationEnabled &&
          styles.pinnedBoardsMenu,
      )}
    >
      {children}
    </div>
  );
};
