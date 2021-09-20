import React from 'react';

import { HomeTestIds } from '@trello/test-ids';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
const l = forTemplate('home');

import styles from './orientation-card.less';

export interface OrientationCardProps {
  backgroundName:
    | 'new-user'
    | 'no-content'
    | 'up-next'
    | 'highlight'
    | 'feedback';
  isBackgroundTop?: boolean;
  titleKey: string;
  textKey: string;
  textCenter?: boolean;
  onDismissClick?: () => void;
  onDismissIconClick?: () => void;
  actionButton?: JSX.Element;
}

// TODO [TMON-640]: Convert <a> to <button>
export const OrientationCard: React.FunctionComponent<OrientationCardProps> = ({
  titleKey,
  textKey,
  textCenter,
  backgroundName,
  isBackgroundTop,
  onDismissClick,
  onDismissIconClick,
  children,
  actionButton,
}) => (
  <div
    className={classNames(styles.orientationCard, {
      [styles.orientationCardBackgroundTop]: isBackgroundTop,
    })}
  >
    <div
      className={classNames(
        styles.background,
        styles[`backgroundName-${backgroundName}`],
        { [styles.backgroundTop]: isBackgroundTop },
      )}
    />
    {onDismissIconClick && (
      <button className={styles.dismissButtonIcon} onClick={onDismissIconClick}>
        <span className={classNames('icon-sm', 'icon-close')} />
      </button>
    )}
    <div className={styles.infoContainer}>
      <span
        className={classNames(styles.title, {
          [styles.textCenter]: textCenter,
        })}
      >
        {l(titleKey)}
      </span>
      <span
        className={classNames(styles.text, { [styles.textCenter]: textCenter })}
      >
        {l(textKey)}
      </span>
      {children}
      {onDismissClick && (
        <button
          className={classNames(styles.dismissButton, 'quiet', {
            [styles.dismissButtonBackgroundTop]: isBackgroundTop,
          })}
          onClick={onDismissClick}
          data-test-id={`${HomeTestIds.DismissOrientationCard}${backgroundName}`}
        >
          {l('orientation-dismiss')}
        </button>
      )}
      {actionButton}
    </div>
  </div>
);

interface CreateTeamBoardOrientationCardProps {
  onCreateTeamBoardClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDismissClick?: () => void;
}

export const CreateTeamBoardOrientationCard: React.FunctionComponent<CreateTeamBoardOrientationCardProps> = ({
  onCreateTeamBoardClick,
  onDismissClick,
}) => (
  <OrientationCard
    titleKey={'orientation-new-user-title'}
    textKey={'orientation-new-user-text'}
    backgroundName={'new-user'}
    onDismissClick={onDismissClick}
    isBackgroundTop={true}
  >
    <button
      className={classNames(
        'nch-button',
        'nch-button--primary',
        styles.createBoardButton,
      )}
      onClick={onCreateTeamBoardClick}
    >
      {l('home-create-team-board')}
    </button>
  </OrientationCard>
);

interface CreateBoardOrientationCardProps {
  onCreateBoardClick: () => void;
  onDismissClick?: () => void;
  boardName: string;
  onBoardNameChange: (boardName: string) => void;
  autofocus?: boolean;
  inputDisabled?: boolean;
  buttonDisabled?: boolean;
}

export const CreateBoardOrientationCard: React.FunctionComponent<CreateBoardOrientationCardProps> = ({
  onCreateBoardClick,
  onDismissClick,
  boardName,
  onBoardNameChange,
  autofocus = false,
  inputDisabled = false,
  buttonDisabled = false,
}) => (
  <OrientationCard
    titleKey={'orientation-new-user-title'}
    textKey={'orientation-new-user-text'}
    backgroundName={'new-user'}
    onDismissClick={onDismissClick}
    isBackgroundTop={true}
  >
    <input
      type="text"
      className={styles.createBoardInput}
      placeholder={l('orientation-create-board-input')}
      // eslint-disable-next-line react/jsx-no-bind
      onChange={({ currentTarget }) => onBoardNameChange(currentTarget.value)}
      value={boardName}
      // eslint-disable-next-line react/jsx-no-bind
      ref={(input) => input && autofocus && input.focus()}
      disabled={inputDisabled}
    />
    <button
      className={classNames(
        'nch-button',
        'nch-button--primary',
        styles.createBoardButton,
        {
          disabled: buttonDisabled,
        },
      )}
      disabled={buttonDisabled}
      onClick={onCreateBoardClick}
    >
      {l('orientation-create-board-button')}
    </button>
  </OrientationCard>
);
