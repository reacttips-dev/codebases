/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

enum LocalStorageKey {
  clusterConsoleHistory = 'CLUSTER_CONSOLE_HISTORY',
  deploymentDisplayMode = 'DEPLOYMENT_DISPLAY_MODE',
  euiTheme = 'EUI_THEME',
  filterContextQueries = 'FILTER_CONTEXT_QUERIES',
  herokuCluster = 'HEROKU_CLUSTER',
  introduceRbacDismissed = 'INTRODUCE_RBAC_DISMISSED',
  trialExperienceDismissed = 'TRIAL_EXPIRED_DISMISSED',
  acceptCookiesDismissed = 'ACCEPT_COOKIES_DISMISSED',
  trialEndingCalloutDismissed = 'TRIAL_ENDING_CALLOUT_DISMISSED',
  cloudPortalBlogLinksVisited = 'CLOUD_PORTAL_BLOG_LINKS_VISITED',
  activityFeedScope = 'ACTIVITY_FEED_SCOPE',
  slmCalloutDismissed = 'SLM_CALLOUT_DISMISSED',
  ilmMigration = 'MIGRATED_TO_ILM',
  appsearchCalloutDismissed = 'APPSEARCH_CALLOUT_DISMISSED',
  enableAutoscalingDismissed = 'ENABLE_AUTOSCALING_DISMISSED',
  autoscalingLimitReachedDismissed = 'AUTOSCALE_LIMIT_REACHED_DISMISSED',
  fleetAvailableDismissed = 'FLEET_AVAILABLE_DISMISSED',
}

export function getIlmMigrationLsKey({ deploymentId }: { deploymentId: string }): string {
  return `${LocalStorageKey.ilmMigration}_${deploymentId}`
}

export function getEnableAutoscalingLsKey({ deploymentId }: { deploymentId: string }): string {
  return `${LocalStorageKey.enableAutoscalingDismissed}_${deploymentId}`
}

export default LocalStorageKey
