import { MARKETING_STARTER, MARKETING_STARTER_EMAIL } from 'self-service-api/constants/UpgradeProducts';
// Consolidate marketing starter upgrade product under the marketing-starter-email upgrade product
export var getCorrectedUpgradeData = function getCorrectedUpgradeData(upgradeData) {
  return upgradeData.upgradeProduct === MARKETING_STARTER ? Object.assign({}, upgradeData, {
    upgradeProduct: MARKETING_STARTER_EMAIL
  }) : upgradeData;
};