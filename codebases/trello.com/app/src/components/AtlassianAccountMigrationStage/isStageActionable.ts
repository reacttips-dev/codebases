// Utility function to determine whether the overlay would be functional.
import { AtlassianAccountMigrationStage } from './types';

export const isStageActionable = (
  stage: AtlassianAccountMigrationStage | null,
) =>
  stage === AtlassianAccountMigrationStage.migration ||
  stage === AtlassianAccountMigrationStage.emailHygiene;
