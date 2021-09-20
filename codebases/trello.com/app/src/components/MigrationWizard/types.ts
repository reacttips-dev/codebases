/* eslint-disable @trello/disallow-filenames */
export enum MigrationWizardSteps {
  INTRO = 'intro',
  MOVE_YOUR_BOARDS = 'move-your-boards',
  BC_FOR_FREE = 'bc-for-free',
  MEMBERSHIPS = 'memberships',
  BOARD_VISIBILITY = 'board-visibility',
  COMPLEX_MOVE_BOARDS = 'complex-move-boards',
  POST_MIGRATION = 'post-migration-cleanup',
  DONE = 'done',
}

export interface StepConfig {
  key: MigrationWizardSteps;
  ScreenComponent: React.ReactNode;
  isCloseable?: boolean;
  isBackAvailable?: boolean;
}

export type StepConfigurationObject = {
  [key in MigrationWizardSteps]: StepConfig;
};

export enum MigrationWizardExperience {
  Post = 'post',
  Pre = 'pre',
  Desktop = 'desktop',
  Advanced = 'advanced',
  VeryHeavyUsage = 'very heavy usage',
  SuccessVeryHeavyUsage = 'success very heavy usage',
  GoldUserWithTeamlessBoards = 'gold user with teamless boards',
  None = 'none',
}
