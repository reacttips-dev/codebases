import { PremiumFeature } from './types';

/**
 * @see https://bitbucket.org/trello/server/src/main/app/data/features.js#lines-7
 */
export const trelloGoldFromBCFeatures: Set<PremiumFeature> = new Set([
  'additionalStickers',
  'customStickers',
  'additionalBoardBackgrounds',
  'customBoardBackgrounds',
  'largeAttachments',
  'customEmoji',
  'savedSearches',
  'butler',
]);

/**
 * @see https://bitbucket.org/trello/server/src/main/app/data/features.js#lines-18
 */
export const trelloGoldFeatures: Set<PremiumFeature> = new Set([
  ...trelloGoldFromBCFeatures,
  'crown',
  'readSecrets',
  'threePlugins',
]);

/**
 * @see https://bitbucket.org/trello/server/src/main/app/data/features.js#lines-25
 */
export const businessClassFeaturesVersion2: Set<PremiumFeature> = new Set([
  // BC1 Standard Features
  'export',
  'observers',
  'removal',
  'activity',
  'deactivated',
  'googleApps',
  'superAdmins',
  'privateTemplates',
  'inviteBoard',
  'inviteOrg',
  'restrictVis',

  // web-only hard-coded faux BC features (not returned by server)
  'logo',
  'orgCards',
  'orgMembersPage',
  'prefs',

  // BC2 Added Features
  'goldMembers',
  'csvExport',
  'shortExportHistory',
]);

/**
 * @see https://bitbucket.org/trello/server/src/main/app/data/features.js#lines-59
 */
export const businessClassFeaturesVersion3: Set<PremiumFeature> = new Set([
  ...businessClassFeaturesVersion2,
  'butlerBC',
  'tags',
  'plugins',
  'starCounts',
  'readSecrets',
  'advancedChecklists',
  'boardExport',
]);

export const businessClassFeaturesVersion3WithMBG: Set<PremiumFeature> = new Set(
  [...businessClassFeaturesVersion3, 'toBeUpgradedToMBGPlan'],
);

/**
 * @see https://bitbucket.org/trello/server/src/main/app/data/features.js#lines-71
 */
export const businessClassFeaturesVersion3x3: Set<PremiumFeature> = new Set([
  ...businessClassFeaturesVersion3,
  'multiBoardGuests',
  'views',
]);

/**
 * @see https://bitbucket.org/trello/server/src/main/app/data/features.js#lines-106
 */
export const enterpriseFeatures: Set<PremiumFeature> = new Set([
  ...businessClassFeaturesVersion3,
  'butlerEnterprise',
  'enterpriseUI',
  'views',
  'stats',
]);
