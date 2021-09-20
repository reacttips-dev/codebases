import React, { useEffect, useCallback, useMemo } from 'react';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import { forNamespace } from '@trello/i18n';
import { SelectableCompactBoardTile } from 'app/src/components/SelectableCompactBoardTile/SelectableCompactBoardTile';
import { useAvailableWorkspaces } from './useAvailableWorkspaces';
import { canAddBoardToOrganization } from '@trello/organizations';
import { MigratedBoardsQuery } from './MigratedBoardsQuery.generated';
import { SelectedBoardsAction } from './useBoardSelector';
import styles from './MigrationWizardBoardsList.less';
import { useKeyboard } from './useKeyboard';

const format = forNamespace(['migration wizard']);

type SelectedBoards = string[];

interface MigrationWizardBoardsList {
  loadingBoards: boolean;
  boards: NonNullable<MigratedBoardsQuery['organization']>['boards'];
  workspace?: ReturnType<typeof useAvailableWorkspaces>['workspaces'][number];
  selectedBoards: SelectedBoards;
  updateBoards: React.Dispatch<SelectedBoardsAction>;
  isMovingBoards: boolean;
}

export const MigrationWizardBoardsList: React.FC<MigrationWizardBoardsList> = ({
  loadingBoards,
  boards,
  workspace,
  selectedBoards,
  updateBoards,
  isMovingBoards,
}) => {
  const canAddBoardToWorkspace = useCallback(
    (board) => {
      return (
        workspace &&
        board &&
        canAddBoardToOrganization({
          org: workspace,
          board: board,
          isOrgAdmin: workspace.isAdmin,
        })
      );
    },
    [workspace],
  );

  const {
    setRefAtIndex,
    onKeyboardNavigationBoardList,
    setActiveElementIndex,
  } = useKeyboard();

  const restrictedBoards = useMemo(() => {
    if (!workspace) return [];

    return boards
      .filter((board) => !canAddBoardToWorkspace(board))
      .map((board) => board.id);
  }, [workspace, boards, canAddBoardToWorkspace]);

  const numFreeBoardsAvailable = Math.min(
    boards.length,
    workspace?.numberOfFreeBoardsAvailable === null
      ? 10
      : workspace?.numberOfFreeBoardsAvailable!,
  );
  const numBoardsAvailable = Math.min(
    numFreeBoardsAvailable,
    boards.length - restrictedBoards.length,
  );
  const areAllBoardsSelected =
    selectedBoards.length > 0 && selectedBoards.length === numBoardsAvailable;
  const hasReachedMaxFreeBoards =
    selectedBoards.length >= numFreeBoardsAvailable;

  const onSelectAll = () => {
    if (!workspace) {
      return;
    }

    if (workspace.isPremiumWorkspace) {
      if (selectedBoards.length === numBoardsAvailable) {
        updateBoards({ type: 'clear' });
      } else {
        updateBoards({
          type: 'all',
          idBoards: [...boards]
            .filter(({ id }) => !restrictedBoards.includes(id))
            .map(({ id }) => id),
        });
      }
    } else {
      if (selectedBoards.length === numFreeBoardsAvailable) {
        updateBoards({ type: 'clear' });
      } else {
        updateBoards({
          type: 'all',
          idBoards: [...boards]
            .filter(({ id }) => !restrictedBoards.includes(id))
            .map(({ id }) => id)
            .slice(0, numFreeBoardsAvailable),
        });
      }
    }
  };

  useEffect(() => {
    if (!workspace) {
      return;
    }

    /**
     * If the user switches workspaces, or if the workspace cache updates
     * the number of boards available, then we want to update the selected
     * boards and prevent more from being selected
     */
    if (selectedBoards.length >= numFreeBoardsAvailable) {
      updateBoards({
        type: 'all',
        idBoards: [...selectedBoards]
          .filter((id) => !restrictedBoards.includes(id))
          .slice(0, numFreeBoardsAvailable),
      });

      return;
    } else {
      /**
       * If the user switches workspaces, or if the workspace cache updates
       * the preferences for the workspace, we want to filter out boards that
       * are ineligible to add.
       */
      updateBoards({
        type: 'all',
        idBoards: [...selectedBoards].filter(
          (id) => !restrictedBoards.includes(id),
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoards.length, numFreeBoardsAvailable, updateBoards, workspace]);

  return (
    <div>
      {Boolean(restrictedBoards.length) && (
        <MigrationWizardMessagePill type="alert">
          {format('complex-move-boards-alert-cannot-add-boards')}{' '}
          <a href="https://help.trello.com/article/710-setting-up-your-business-class-team#Visibility-and-control">
            {format('post-migration-banner-learn-more')}
          </a>
        </MigrationWizardMessagePill>
      )}
      <div className={styles.boardsContainer}>
        <h3>
          {workspace && !workspace.isPremiumWorkspace
            ? format('start-migration-selection-prompt-free', {
                selectedBoards: selectedBoards.length,
                remainingBoards: numBoardsAvailable,
              })
            : format('start-migration-selection-prompt', {
                selectedBoards: selectedBoards.length,
              })}
          {!!workspace && workspace.numberOfFreeBoardsAvailable !== 0 && (
            <Button
              appearance="subtle-link"
              className={styles.selectionButton}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onSelectAll}
              isDisabled={isMovingBoards}
              testId={MigrationWizardTestIds.SelectAllButton}
            >
              {areAllBoardsSelected
                ? format('start-migration-selection-unselect-all', {
                    count: selectedBoards.length,
                  })
                : format('start-migration-selection-none-or-some-selected')}
            </Button>
          )}
        </h3>

        {loadingBoards ? (
          <Spinner centered />
        ) : (
          <div className={styles.boards}>
            {boards.map((board, index) => {
              const isSelected = selectedBoards.includes(board.id);
              const isRestricted = restrictedBoards.includes(board.id);
              const { id, name, prefs } = board;
              const {
                backgroundTopColor = '',
                backgroundImage = '',
                backgroundImageScaled = [],
                backgroundTile = false,
              } = prefs ?? {};
              const isDisabled =
                !workspace ||
                isRestricted ||
                (!isSelected && hasReachedMaxFreeBoards);

              let title = '';
              if (hasReachedMaxFreeBoards && !isSelected) {
                title = format('reached-max-number-of-open-boards');
              } else if (isRestricted) {
                title = format('create-team-move-boards-restricted-board-2');
              }

              return (
                <div
                  role="radio"
                  key={id}
                  className={styles.boardTile}
                  aria-checked={isSelected}
                  // eslint-disable-next-line react/jsx-no-bind
                  onFocus={() => setActiveElementIndex(index)}
                  onKeyDown={onKeyboardNavigationBoardList(
                    isSelected,
                    board,
                    boards,
                    isDisabled,
                  )}
                >
                  <SelectableCompactBoardTile
                    boardId={id}
                    boardName={name}
                    background={{
                      backgroundTopColor,
                      backgroundImage,
                      backgroundImageScaled,
                      backgroundTile,
                    }}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={
                      isMovingBoards
                        ? undefined
                        : () => {
                            updateBoards({
                              type: isSelected ? 'remove' : 'add',
                              idBoard: id,
                            });
                          }
                    }
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    title={title}
                    testId={MigrationWizardTestIds.BoardTile}
                    tabIndex={0}
                    setRef={setRefAtIndex(index)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
