import { MomentFormatSpecification } from 'moment';
import { freeze } from '@trello/objects';

/**
 * Somewhat different from app/scripts/debug/constants.ts::Feature; these are
 * all features that have some rollout configuration defined for the sake of
 * in-app "new" messaging.
 */
export enum FeatureId {
  AutomaticReports = 'AutomaticReports',
  BoardBkgdGradients = 'BoardBkgdGradients',
  ButlerOnBoardsV2 = 'ButlerOnBoardsV2',

  // Not a real feature; used exclusively for unit tests. Do not sort!
  TestFeature = 'TestFeature',
}

export const MOMENT_FORMAT: MomentFormatSpecification = 'MM-DD-YYYY';
// Mirrors MOMENT_FORMAT.
type DateStringFormat = `${number}-${number}-${number}`;

// eslint-disable-next-line @trello/no-module-logic
export const FeatureRolloutConfig = freeze<
  Record<FeatureId, [release: DateStringFormat, expiration: DateStringFormat]>
>({
  [FeatureId.AutomaticReports]: ['07-01-2021', '10-01-2021'],
  [FeatureId.BoardBkgdGradients]: ['03-01-2021', '06-01-2021'],
  [FeatureId.ButlerOnBoardsV2]: ['03-01-2021', '05-01-2021'],

  // Defined exclusively for unit tests; don't sort this.
  [FeatureId.TestFeature]: ['01-01-2021', '01-01-2022'],
});
