import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import { Spinner } from '@trello/nachos/spinner';
import { Button } from '@trello/nachos/button';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { forNamespace } from '@trello/i18n';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import { MigrationWizardBoardVisibilityChooser } from './MigrationWizardBoardVisibilityChooser';
import { useSelectedWorkspace } from './useSelectedWorkspace';
import { SelectableCompactBoardTile } from 'app/src/components/SelectableCompactBoardTile';
import { Key, getKey } from '@trello/keybindings';
import classNames from 'classnames';
import React, { useState, useContext, useCallback } from 'react';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardSteps } from './types';
import styles from './MigrationWizardBoardVisibility.less';

const format = forNamespace(['migration wizard']);
const formatError = forNamespace(['alerts']);

interface MigrationWizardBoardVisibilityProps {}

export const MigrationWizardBoardVisibility: React.FC<MigrationWizardBoardVisibilityProps> = () => {
  const [error, setError] = useState('');
  const { boards, org, loading } = useSelectedWorkspace();
  const { onNext } = useContext(MigrationWizardContext);

  const onKeyDownNextButton = useCallback(() => {
    (event: React.KeyboardEvent<HTMLElement>) => {
      switch (getKey(event)) {
        case Key.Enter:
          onNext?.(MigrationWizardSteps.DONE);
          break;
        case Key.Tab:
          // a hack for keeping focus inside the modal without focus trap
          event.preventDefault();
          break;
        default:
          return;
      }

      event.preventDefault();
    };
  }, [onNext]);

  return (
    <div className={styles.container}>
      <h2>{format('board-visibility-title')}</h2>
      <p>{format('board-visibility-body')}</p>
      <ul className={styles.visibilityList}>
        <li>
          <span
            className={classNames(styles.permissionIcon, styles.stayPrivate)}
          >
            <PrivateIcon />
          </span>
          {format('board-visibility-list1-private')}
        </li>
        <li>
          <span className={classNames(styles.permissionIcon, styles.private)}>
            <SubscribeIcon />
          </span>
          {format('board-visibility-list2-private-members')}
        </li>
        <li>
          <span className={classNames(styles.permissionIcon, styles.team)}>
            <OrganizationIcon />
          </span>
          {format('board-visibility-list3-workspace-2')}
        </li>
      </ul>
      <div className={styles.tableWrapper}>
        {loading || !org ? (
          <Spinner centered />
        ) : (
          <table>
            <thead>
              <tr>
                <th>{format('board-visibility-boards-list')}</th>
                <th>{format('board-visibility-boards-vis')}</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board, index) => {
                const { permissionLevel = 'private', ...background } =
                  board.prefs ?? {};

                return (
                  <tr
                    key={board.id}
                    data-test-id={MigrationWizardTestIds.BoardVisibilityItem}
                  >
                    <td>
                      <div role="button" className={styles.boardTile}>
                        <SelectableCompactBoardTile
                          boardId={board.id}
                          boardName={board.name}
                          background={background}
                          tabIndex={-1}
                        />
                      </div>
                    </td>
                    <td>
                      <MigrationWizardBoardVisibilityChooser
                        idBoard={board.id}
                        permissionLevel={permissionLevel}
                        org={org}
                        // eslint-disable-next-line react/jsx-no-bind
                        onError={() => {
                          setError(formatError('something-went-wrong'));
                        }}
                        // eslint-disable-next-line react/jsx-no-bind
                        onSuccess={() => {
                          setError('');
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <hr />
      {error !== '' && (
        <MigrationWizardMessagePill type="error">
          {error}
        </MigrationWizardMessagePill>
      )}
      <p className={styles.footerText}>{format('board-visibility-footer')}</p>
      <Button
        appearance="primary"
        onKeyDown={onKeyDownNextButton}
        className={styles.button}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          onNext?.(MigrationWizardSteps.DONE);
        }}
        testId={MigrationWizardTestIds.BoardVisibilityNextButton}
        isDisabled={loading}
      >
        {format('create-team-move-boards-next-button')}
      </Button>
    </div>
  );
};
