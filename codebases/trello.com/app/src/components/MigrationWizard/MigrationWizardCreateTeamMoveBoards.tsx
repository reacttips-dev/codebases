import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { forNamespace } from '@trello/i18n';
import { MigrationWizardSteps } from './types';
import { FREE_TRIAL_THRESHOLD, screenToSource } from './constants';
import { useCreateTeamAndMoveBoards } from './useCreateTeamAndMoveBoards';
import { SelectableCompactBoardTile } from 'app/src/components/SelectableCompactBoardTile';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import styles from './MigrationWizardCreateTeamMoveBoards.less';
import { Key, getKey } from '@trello/keybindings';
import { useKeyboard } from './useKeyboard';
import { Analytics } from '@trello/atlassian-analytics';
const format = forNamespace(['migration wizard']);
const formatError = forNamespace(['error handling', 'organization']);

interface MigrationWizardCreateTeamMoveBoardsProps {}

export const MigrationWizardCreateTeamMoveBoards: React.FC<MigrationWizardCreateTeamMoveBoardsProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [boardSelectionError, setBoardSelectionError] = useState();
  const {
    teamlessBoards,
    selectedBoards,
    updateBoards,
    onNext,
    teamName,
    setTeamName,
    orgId,
  } = useContext(MigrationWizardContext);
  const {
    createTeamAndMoveBoards,
    teamNameError,
    setTeamNameError,
    teamError,
  } = useCreateTeamAndMoveBoards();
  const {
    setRefAtIndex,
    onKeyboardNavigationBoardList,
    setActiveElementIndex,
  } = useKeyboard();

  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const onSubmit = useCallback(async () => {
    if (teamName.length === 0) {
      setTeamNameError(formatError('ORG_DISPLAY_NAME_SHORT'));
      return;
    }

    if (teamName.length > 100) {
      setTeamNameError(formatError('ORG_DISPLAY_NAME_LONG'));
      return;
    }

    if (selectedBoards.length > FREE_TRIAL_THRESHOLD) {
      onNext?.(MigrationWizardSteps.BC_FOR_FREE);
    } else {
      const taskName = 'create-organization/migrationWizard';
      const source = screenToSource[MigrationWizardSteps.MOVE_YOUR_BOARDS];
      const traceId = Analytics.startTask({ taskName, source });

      try {
        setIsLoading(true);
        await createTeamAndMoveBoards(teamName, selectedBoards);
        Analytics.taskSucceeded({ taskName, traceId, source });
      } catch (err) {
        Analytics.taskFailed({
          taskName,
          traceId,
          source,
          error: err,
        });
        setBoardSelectionError(err);
      }
    }
  }, [
    createTeamAndMoveBoards,
    onNext,
    selectedBoards,
    setTeamNameError,
    teamName,
  ]);

  useEffect(() => {
    if (orgId !== '') {
      //we are not setting isLoading(false) here because we want the spinner to render until the screen is unmounted.
      //setting it makes the spinner disappear & a long gap of time before moving to the next screen.
      onNext?.(MigrationWizardSteps.MEMBERSHIPS);
    }
  }, [orgId, onNext]);

  // select all boards on first render
  useEffect(() => {
    updateBoards({
      type: 'all',
      idBoards: teamlessBoards.map((board) => board.id),
    });
    // We only want the very first load of boards to be selected. If for
    // whatever reason a subsequent payload contains more boards, we'd overwrite
    // the user's current selection of boards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let error;
  if (teamNameError) {
    error = teamNameError;
  } else if (boardSelectionError) {
    error = boardSelectionError;
  } else if (teamError) {
    error = teamError;
  } else {
    error = '';
  }

  // If we try to do this at render we haven't given enough time
  // for the state to update the text input, so adding a timeout
  // defers this til the text has been set and then selects it.
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef?.current?.focus();
        inputRef?.current?.select();
      }, 500);
    }
  }, [inputRef]);

  const isDisabled =
    selectedBoards.length === 0 || teamName.length === 0 || isLoading;

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // pressing enter with the team name input selected changes screens,
      // as long as the button is not disabled
      nextButtonRef?.current?.focus();
      if (!isDisabled) {
        onSubmit();
      }
    },
    [isDisabled, onSubmit],
  );

  const onKeyDownNextButton = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      switch (getKey(event)) {
        // when the "next" button is in focus & not disabled, pressing enter
        // creates a new workspace & takes you to the next screen
        case Key.Enter:
          if (!isDisabled) {
            onSubmit();
          }
          break;
        case Key.Tab:
          // when the "next" button is in focus & you press Tab
          //the focus circles back up to the team name input field
          // This is how we are keeping focus inside of the modal on this screen
          inputRef?.current?.focus();
          break;
        default:
          return;
      }

      event.preventDefault();
    },
    [isDisabled, onSubmit],
  );

  return (
    <div className={styles.container}>
      <form onSubmit={onFormSubmit}>
        <h2>{format('create-team-move-boards-title')}</h2>
        <p>{format('create-team-move-boards-body')}</p>
        <hr />
        <label htmlFor="migrationWizardMoveBoards">
          {format('create-team-move-boards-add-boards-prompt')}
        </label>
        <input
          id="migrationWizardMoveBoards"
          ref={inputRef}
          tabIndex={0}
          name="teamName"
          type="text"
          value={teamName}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => {
            setTeamNameError('');
            setTeamName(e.currentTarget.value);
          }}
          data-test-id={MigrationWizardTestIds.TeamNameInput}
        />
        <Button
          appearance="subtle-link"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            updateBoards({ type: 'clear' });
            onNext?.(MigrationWizardSteps.COMPLEX_MOVE_BOARDS);
          }}
          className={styles.selectAnotherButton}
          testId={MigrationWizardTestIds.SelectOtherTeamButton}
          tabIndex={0}
        >
          {format('create-team-move-boards-different-workspace-prompt')}
        </Button>
        <h3 tabIndex={-1}>
          {format(
            'create-team-move-boards-selection-prompt-all-or-none-selected',
            { selectedBoards: selectedBoards.length },
          )}
          <Button
            tabIndex={0}
            appearance="subtle-link"
            className={styles.selectionButton}
            testId={MigrationWizardTestIds.SelectAllButton}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              if (selectedBoards.length > 0) {
                updateBoards({ type: 'clear' });
              } else {
                updateBoards({
                  type: 'all',
                  idBoards: teamlessBoards.map((board) => board.id),
                });
              }
            }}
          >
            {selectedBoards.length > 0
              ? format('start-migration-selection-unselect-all', {
                  count: selectedBoards.length,
                })
              : format('start-migration-selection-none-or-some-selected')}
          </Button>
        </h3>
        <div className={styles.boards}>
          {teamlessBoards.map((board, index) => {
            const {
              backgroundTopColor = '',
              backgroundImage = '',
              backgroundImageScaled = [],
              backgroundTile = false,
            } = board.prefs ?? {};
            const selected = selectedBoards.includes(board.id);
            return (
              <div
                role="radio"
                onKeyDown={onKeyboardNavigationBoardList(
                  selected,
                  board,
                  teamlessBoards,
                )}
                key={board.id}
                className={styles.boardTile}
                aria-checked={selected}
                // eslint-disable-next-line react/jsx-no-bind
                onFocus={() => setActiveElementIndex(index)}
              >
                <SelectableCompactBoardTile
                  boardId={board.id}
                  boardName={board.name}
                  background={{
                    backgroundTopColor,
                    backgroundImage,
                    backgroundImageScaled,
                    backgroundTile,
                  }}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => {
                    updateBoards({
                      type: selected ? 'remove' : 'add',
                      idBoard: board.id,
                    });
                  }}
                  isSelected={selected}
                  testId={MigrationWizardTestIds.BoardTile}
                  tabIndex={0}
                  setRef={setRefAtIndex(index)}
                />
              </div>
            );
          })}
        </div>
        <hr className={styles.bottomLine} />
        {selectedBoards.length === 0 && (
          <p className={styles.note}>
            {format('create-team-move-boards-selection-noneselected-footer')}
          </p>
        )}

        {error && (
          <MigrationWizardMessagePill type="error">
            {error}
          </MigrationWizardMessagePill>
        )}

        <Button
          appearance="primary"
          className={styles.nextButton}
          onClick={onSubmit}
          ref={nextButtonRef}
          isDisabled={isDisabled}
          testId={MigrationWizardTestIds.CreateBoardsNextButton}
          tabIndex={0}
          onKeyDown={onKeyDownNextButton}
        >
          {isLoading ? (
            <Spinner small />
          ) : (
            format('create-team-move-boards-next-button')
          )}
        </Button>
      </form>
    </div>
  );
};
