/**
 * this is where the main controls to enable or disable the feature flag
 * for sponsorships thresholds
 
 * to remove the feature flag code, grep for:
 * SPONSORSHIPS_THRESHOLD_FEATURE_POST_LAUNCH
 * each spot where that text is located has some intructions on how to remove
 * the feature flag code
 */

const ALLOW_LIST_WEB_STATION_IDS: string[] = ['a74e78'];

const ENABLE_SPONSORSHIPS_THRESHOLD = true;

export function getIsSponsorshipsThresholdEnabled(webStationId: string | null) {
  return (
    ENABLE_SPONSORSHIPS_THRESHOLD ||
    (webStationId && ALLOW_LIST_WEB_STATION_IDS.includes(webStationId))
  );
}
