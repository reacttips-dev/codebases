import classNames from 'classnames';
import React, {
  useLayoutEffect,
  useCallback,
  useState,
  useRef,
  Suspense,
} from 'react';

import { Spinner } from '@trello/nachos/spinner';
import { HeaderTestIds } from '@trello/test-ids';
import { forNamespace, forTemplate } from '@trello/i18n';
import {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} from '@trello/keybindings';
import { isMac, isDesktop, isTouch } from '@trello/browser';
import { shouldHandleWindowsFrame } from '@trello/desktop';
import { useFeatureFlag } from '@trello/feature-flag-client';

import BoardList from './board-list';
import styles from './boards-menu.less';
import BoardsSearch from './boards-search';
import { BoardsMenuContainerProps } from './types';
import { BoardsMenuButton } from './boards-menu-button';

import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import {
  useBoardsMenuVisibility,
  BoardsMenuVisibilityState,
} from 'app/src/components/BoardsMenuVisibility';

import { useWorkspaceNavigation } from 'app/src/components/WorkspaceNavigation';
import { useLazyComponent } from '@trello/use-lazy-component';

const format = forTemplate('boards_sidebar');
const formatRaw = forNamespace([], { shouldEscapeStrings: false });

export const BoardsMenu: React.FunctionComponent<BoardsMenuContainerProps> = ({
  clearSearchText,
  clearSelectedBoard,
  idMe,
  categoriesWithBoards,
  filteredBoards,
  isLoggedIn,
  isSearching,
  loading,
  searchText,
  selectedBoard,
  prepareToShowCreateBoard,
  visibleBoards,
}) => {
  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/gamma/src/components/overlays/create-board-overlay'
      ),

    {
      preload: false,
    },
  );

  const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);

  const closeCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(false);
  }, [setShowCreateBoardOverlay]);

  const openCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(true);
  }, [setShowCreateBoardOverlay]);

  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const {
    boardsMenuVisibility,
    setBoardsMenuVisibility,
  } = useBoardsMenuVisibility();

  const [{ enabled: workspaceNavigationEnabled }] = useWorkspaceNavigation();
  const isHeadsUpMsgEnabled = useFeatureFlag(
    'teamplates.web.boards-menu-heads-up-message',
    false,
  );

  const [shouldFocusInput, setShouldFocusInput] = useState(true);

  const isBoardsMenuPinned =
    boardsMenuVisibility === BoardsMenuVisibilityState.PINNED;
  const isBoardsMenuVisible =
    boardsMenuVisibility !== BoardsMenuVisibilityState.CLOSED;

  const focusInputIfNecessary = useCallback(() => {
    if (shouldFocusInput) {
      searchRef?.current?.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput, searchRef]);

  const toggleBoardsMenuPopover = useCallback(() => {
    setBoardsMenuVisibility(
      boardsMenuVisibility === BoardsMenuVisibilityState.POPOVER
        ? BoardsMenuVisibilityState.CLOSED
        : BoardsMenuVisibilityState.POPOVER,
    );
  }, [boardsMenuVisibility, setBoardsMenuVisibility]);

  const onBKeypress: React.KeyboardEventHandler<HTMLElement> = useCallback(() => {
    // Do not attempt to open the boards menu unless the user is
    // logged in OR we are showing the workspace navigation
    if (!idMe) {
      return;
    }

    if (boardsMenuVisibility !== BoardsMenuVisibilityState.PINNED) {
      toggleBoardsMenuPopover();

      Analytics.sendPressedShortcutEvent({
        shortcutName: 'boardsMenuShortcut',
        keyValue: 'b',
        source: getScreenFromUrl(),
      });

      if (boardsMenuVisibility === BoardsMenuVisibilityState.CLOSED) {
        Analytics.sendScreenEvent({
          name: 'boardsMenuInlineDialog',
          attributes: {
            method: 'boardsMenuShortcut',
          },
        });
      } else {
        Analytics.sendClosedComponentEvent({
          componentName: 'boardsMenuInlineDialog',
          componentType: 'inlineDialog',
          source: getScreenFromUrl(),
          attributes: {
            method: 'boardsMenuShortcut',
          },
        });
      }
    }

    setShouldFocusInput(true);
  }, [idMe, boardsMenuVisibility, toggleBoardsMenuPopover]);

  const onEscapeKeypress: React.KeyboardEventHandler<HTMLElement> = useCallback(() => {
    if (boardsMenuVisibility === BoardsMenuVisibilityState.POPOVER) {
      toggleBoardsMenuPopover();
      Analytics.sendPressedShortcutEvent({
        shortcutName: 'escapeShortcut',
        source: 'boardsMenuInlineDialog',
        keyValue: 'esc',
      });
      Analytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'boardsMenuInlineDialog',
        source: getScreenFromUrl(),
        attributes: {
          method: 'escapeShortcut',
        },
      });
    }
  }, [boardsMenuVisibility, toggleBoardsMenuPopover]);

  const onDocumentClick = useCallback(
    (e: MouseEvent) => {
      const target: Element = e.target as Element;

      if (boardsMenuVisibility !== BoardsMenuVisibilityState.POPOVER) {
        return;
      }

      const isOutsideClick = !ref.current?.contains(target);

      // If the click occurred on a board tile, close the menu. Ideally this
      // would happen in the board tiles
      if (!isOutsideClick && target.closest('a[href]')) {
        setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
      }

      // If the click occurred outside the boards menu container, treat as a
      // dismissal and close
      if (isOutsideClick) {
        setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
        Analytics.sendClosedComponentEvent({
          componentType: 'inlineDialog',
          componentName: 'boardsMenuInlineDialog',
          source: getScreenFromUrl(),
          attributes: {
            method: 'clicked outside of inline dialog',
          },
        });
      }
    },
    [boardsMenuVisibility, ref, setBoardsMenuVisibility],
  );

  const onCreateBoardButtonClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'createBoardLink',
      source: 'boardsMenuInlineDialog',
      attributes: {
        whileSearching: isSearching,
      },
    });

    prepareToShowCreateBoard();
    openCreateBoardOverlay();
    setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
  }, [
    isSearching,
    setBoardsMenuVisibility,
    prepareToShowCreateBoard,
    openCreateBoardOverlay,
  ]);

  const onPinBoardsMenuButtonClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'alwaysKeepMenuOpenLink',
      source: 'boardsMenuInlineDialog',
      attributes: {
        wasPreviouslyPinned: isBoardsMenuPinned,
      },
    });

    setBoardsMenuVisibility(
      isBoardsMenuPinned
        ? BoardsMenuVisibilityState.POPOVER
        : BoardsMenuVisibilityState.PINNED,
    );
  }, [isBoardsMenuPinned, setBoardsMenuVisibility]);

  const ClosedBoardsOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "closed-boards-overlay" */ 'app/src/components/ClosedBoardsOverlay'
      ),
    {
      preload: isBoardsMenuVisible,
    },
  );
  const [showClosedBoardsOverlay, setShowClosedBoardsOverlay] = useState(false);

  const onShowClosedBoardsButtonClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'seeClosedBoardsLink',
      source: 'boardsMenuInlineDialog',
    });

    setShowClosedBoardsOverlay(true);
    setBoardsMenuVisibility(BoardsMenuVisibilityState.CLOSED);
  }, [setBoardsMenuVisibility, setShowClosedBoardsOverlay]);

  // useEffect is asynchronous in React 17. This means that document.removeEventListener can run at a non-deterministic
  // point. This can cause confusing interactions between elements that register document-level event handlers. By using
  // useLayoutEffect, the functions become synchronous and more deterministic, and we can ensure the removeEventListener
  // call is executed before the DOM is manipulated. This fixes a bug where sometimes the boards menu wouldn't open
  // depending what else the user had already clicked on the page (particularly Nachos Select components).
  useLayoutEffect(() => {
    switch (boardsMenuVisibility) {
      case BoardsMenuVisibilityState.CLOSED:
        !workspaceNavigationEnabled &&
          registerShortcut(onBKeypress, { scope: Scope.Header, key: Key.b });
        clearSearchText();
        clearSelectedBoard();
        setShouldFocusInput(true);
        break;
      case BoardsMenuVisibilityState.POPOVER:
        Analytics.sendScreenEvent({
          name: 'boardsMenuInlineDialog',
        });
        document.addEventListener('click', onDocumentClick);
        registerShortcut(onEscapeKeypress, {
          scope: Scope.Popover,
          key: Key.Escape,
        });
        focusInputIfNecessary();
        break;
      case BoardsMenuVisibilityState.PINNED:
        !workspaceNavigationEnabled &&
          registerShortcut(onBKeypress, { scope: Scope.Header, key: Key.b });
        focusInputIfNecessary();
        break;
      default:
        break;
    }

    return () => {
      document.removeEventListener('click', onDocumentClick);
      unregisterShortcut(onEscapeKeypress);
      unregisterShortcut(onBKeypress);
    };
  }, [
    boardsMenuVisibility,
    clearSearchText,
    clearSelectedBoard,
    setShouldFocusInput,
    onBKeypress,
    onEscapeKeypress,
    onDocumentClick,
    focusInputIfNecessary,
    workspaceNavigationEnabled,
  ]);

  const renderHeadsUpMsg = () => {
    const sidebarHelpUrl =
      'https://help.trello.com/article/1250-trello-navigation';

    if (!isHeadsUpMsgEnabled) {
      return null;
    }

    return (
      <div className={styles.sidebarHeadsUp}>
        {format(
          'hey-trello-is-getting-an-upgrade-and-this-boards-menu-is-moving-soon',
        )}{' '}
        <a href={sidebarHelpUrl} target="_blank" rel="noopener">
          {format('preview-the-upcoming-trello-sidebar-now')}
        </a>
      </div>
    );
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div
        ref={ref}
        className={classNames(
          styles.boardsDrawer,
          !isBoardsMenuPinned && styles.boardsDrawerPopover,
          shouldHandleWindowsFrame() && styles.desktopWin,
        )}
        hidden={!isBoardsMenuVisible || workspaceNavigationEnabled}
      >
        <div
          className={classNames(
            styles.boardsDrawerHeader,
            isDesktop() && isMac() && styles.desktopMac,
          )}
          hidden={!isBoardsMenuPinned}
        >
          {format('boards')}
        </div>
        <div className={styles.boardsMenuWrapper}>
          <div
            className={styles.boardsMenu}
            data-test-id={HeaderTestIds.BoardsMenuPopover}
          >
            {renderHeadsUpMsg()}
            <BoardsSearch
              ref={searchRef}
              boards={filteredBoards}
              searchText={searchText}
              selectedBoard={selectedBoard}
              visibleBoards={visibleBoards}
              boardsMenuVisibility={boardsMenuVisibility}
              setBoardsMenuVisibility={setBoardsMenuVisibility}
            />
            <BoardList
              categories={categoriesWithBoards}
              hidden={isSearching || loading}
              boardsMenuVisibility={boardsMenuVisibility}
              setBoardsMenuVisibility={setBoardsMenuVisibility}
            />
            {loading && <Spinner>{format('boards')}</Spinner>}
            <div className={styles.buttons}>
              <BoardsMenuButton
                onClick={onCreateBoardButtonClick}
                className={classNames(isSearching && styles.createBoardButton)}
                testId={HeaderTestIds.BoardsMenuCreateBoard}
              >
                {isSearching
                  ? formatRaw('add board named', {
                      boardName: searchText,
                    })
                  : format('create-new-board-ellipsis')}
              </BoardsMenuButton>

              {!isSearching && (
                <>
                  {!isTouch() && (
                    <BoardsMenuButton
                      onClick={onPinBoardsMenuButtonClick}
                      testId={HeaderTestIds.BoardsMenuPin}
                    >
                      {!isBoardsMenuPinned
                        ? format('always-keep-this-menu-open')
                        : format('don-t-keep-this-menu-open')}
                    </BoardsMenuButton>
                  )}
                  <BoardsMenuButton
                    onClick={onShowClosedBoardsButtonClick}
                    testId={HeaderTestIds.BoardsMenuOpenClosed}
                  >
                    {format('see-closed-boards-ellipsis')}
                  </BoardsMenuButton>
                  {showClosedBoardsOverlay && (
                    <Suspense fallback={null}>
                      <ClosedBoardsOverlay
                        // eslint-disable-next-line react/jsx-no-bind
                        onClose={() => {
                          setShowClosedBoardsOverlay(false);
                        }}
                      />
                    </Suspense>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showCreateBoardOverlay && (
        <Suspense fallback={null}>
          <CreateBoardOverlay onClose={closeCreateBoardOverlay} />
        </Suspense>
      )}
    </>
  );
};
