import { BackIcon } from '@trello/nachos/icons/back';
import { CloseIcon } from '@trello/nachos/icons/close';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardTestIds } from '@trello/test-ids';
import React, { useContext } from 'react';
import styles from './MigrationWizardDialog.less';
import classNames from 'classnames';
import { MigrationWizardSteps, StepConfigurationObject } from './types';
import { MigrationWizardStart } from './MigrationWizardStart';
import { MigrationWizardCreateTeamMoveBoards } from './MigrationWizardCreateTeamMoveBoards';
import { MigrationWizardBusinessClass } from './MigrationWizardBusinessClass';
import { MigrationWizardTeamMemberships } from './MigrationWizardTeamMemberships';
import { MigrationWizardBoardVisibility } from './MigrationWizardBoardVisibility';
import { MigrationWizardMoveBoards } from './MigrationWizardMoveBoards';
import { MigrationWizardDone } from './MigrationWizardDone';

export const migrationWizardStepConfiguration: StepConfigurationObject = {
  [MigrationWizardSteps.INTRO]: {
    key: MigrationWizardSteps.INTRO,
    ScreenComponent: <MigrationWizardStart />,
  },
  [MigrationWizardSteps.MOVE_YOUR_BOARDS]: {
    key: MigrationWizardSteps.MOVE_YOUR_BOARDS,
    ScreenComponent: <MigrationWizardCreateTeamMoveBoards />,
    isCloseable: true,
  },
  [MigrationWizardSteps.BC_FOR_FREE]: {
    key: MigrationWizardSteps.BC_FOR_FREE,
    ScreenComponent: <MigrationWizardBusinessClass />,
    isBackAvailable: true,
  },
  [MigrationWizardSteps.MEMBERSHIPS]: {
    key: MigrationWizardSteps.MEMBERSHIPS,
    ScreenComponent: <MigrationWizardTeamMemberships />,
  },
  [MigrationWizardSteps.BOARD_VISIBILITY]: {
    key: MigrationWizardSteps.BOARD_VISIBILITY,
    ScreenComponent: <MigrationWizardBoardVisibility />,
  },
  [MigrationWizardSteps.COMPLEX_MOVE_BOARDS]: {
    key: MigrationWizardSteps.COMPLEX_MOVE_BOARDS,
    ScreenComponent: <MigrationWizardMoveBoards />,
    isCloseable: true,
  },
  [MigrationWizardSteps.POST_MIGRATION]: {
    key: MigrationWizardSteps.POST_MIGRATION,
    ScreenComponent: <MigrationWizardMoveBoards />,
    isCloseable: true,
  },
  [MigrationWizardSteps.DONE]: {
    key: MigrationWizardSteps.DONE,
    ScreenComponent: <MigrationWizardDone />,
    isCloseable: false,
  },
};

export const MigrationWizardDialog: React.FC = () => {
  const { currentStep, onBack, hideWizard } = useContext(
    MigrationWizardContext,
  );
  const {
    ScreenComponent,
    isCloseable,
    isBackAvailable,
  } = migrationWizardStepConfiguration[currentStep];

  return (
    <div className={styles.wizard} data-test-id={MigrationWizardTestIds.Wizard}>
      {ScreenComponent}
      {isCloseable && (
        <button
          className={classNames(styles.iconButton, styles.close)}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={hideWizard}
        >
          <CloseIcon />
        </button>
      )}
      {isBackAvailable && (
        <button
          className={classNames(styles.iconButton, styles.back)}
          onClick={onBack}
        >
          <BackIcon />
        </button>
      )}
    </div>
  );
};
