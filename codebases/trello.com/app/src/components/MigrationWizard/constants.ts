/* eslint-disable @trello/export-matches-filename */

import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
import { MigrationWizardSteps } from './types';

// The user selected 10 or more boards to move
export const FREE_TRIAL_THRESHOLD = 9;
export const MAX_TEAMLESS_BOARDS = 50;
export const WORKSPACE_MIGRATION_SUCCESS_FLAG_TIMEOUT = 4000;

export enum DismissMessageKeys {
  TidyUp = 'teamify-post-migration',
  AutoShow = 'teamify-auto-show',
  VeryHeavyUsage = 'teamify-very-heavy-usage-auto-show',
  GoldUserWithTeamlessBoards = 'teamify-gold-user-with-teamless-boards-auto-show',
}

// An ID used for 'one time message dismissed' for 'very heavy use' migration case
export const WORKSPACE_MIGRATION_SUCCESS_MESSAGE =
  'btg.workspace-migration-success';

export const screenToSource: { [key in MigrationWizardSteps]: SourceType } = {
  [MigrationWizardSteps.INTRO]: 'teamifyIntroModal',
  [MigrationWizardSteps.MOVE_YOUR_BOARDS]: 'teamifyMoveYourBoardsModal',
  [MigrationWizardSteps.BC_FOR_FREE]: 'teamifyBCModal',
  [MigrationWizardSteps.MEMBERSHIPS]: 'teamifyMembershipsModal',
  [MigrationWizardSteps.BOARD_VISIBILITY]: 'teamifyBoardVisibilityModal',
  [MigrationWizardSteps.COMPLEX_MOVE_BOARDS]: 'teamifyComplexMoveBoardsModal',
  [MigrationWizardSteps.POST_MIGRATION]: 'teamifyPostMigrationMoveBoardsModal',
  [MigrationWizardSteps.DONE]: 'teamifyDoneModal',
};
