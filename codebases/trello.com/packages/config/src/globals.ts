import { Client } from './version';
import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

/**
 * Configuration values set by the webpack.DefinePlugin
 * to be injected into the codebase.
 */
declare const __SLACK_TRELLO_DOMAIN__: string;
declare const __SLACK_TRELLO_MICROS_DOMAIN__: string;
declare const __DEVSERVER__: string;
declare const __SLACK_DOMAIN__: string;
declare const __TRELLO_FOR_WEBSITES__: string;
declare const __CUSTOM_FIELDS_ID__: string;
declare const __FIRST_PARTY_PLUGINS_ORG__: string;
declare const __PLUGIN_CI_ORG__: string;
declare const __LIST_LIMITS_POWERUP_ID__: string;
declare const __MAP_POWERUP_ID__: string;
declare const __BITBUCKET_POWERUP_ID__: string;
declare const __ATTACHMENTS_DOMAIN__: string;
declare const __BACKGROUND_DOMAIN__: string;
declare const __LOGO_DOMAIN__: string;
declare const __ONE_DRIVE_CLIENT_ID__: string;
declare const __GOOGLE_DRIVE_CLIENT_ID__: string;
declare const __DROPBOX_CLIENT_APP_KEY__: string;
declare const __BOX_CLIENT_ID__: string;
declare const __STRIPE_API_KEY__: string;
declare const __GOOGLE_MAPS_API_KEY__: string;
declare const __SNOWPLOW_CLOUDFRONT_SERVER__: string;
declare const __ANALYTICS_WEB_CLIENT_ENV__: string;
declare const __ANALYTICS_WEB_CLIENT_API_HOST__: string;
declare const __LAUNCH_DARKLY_KEY__: string;
declare const __ATLASSIAN_FEATURE_FLAG_CLIENT_KEY__: string;
declare const __ENV__: string;
declare const __APPCUES_ACCOUNT_ID__: string;
declare const __IDENTITY_BASE_URL__: string;
declare const __ADMIN_HUB_BASE_URL__: string;
declare const __ATLASSIAN_API_GATEWAY__: string;
declare const __WAC_URL__: string;
declare const __CERTCAPTURE_GENCERT_URL__: string;
declare const __SENTRY_DSN__: string;
declare const __BUTLER_API_BASE_URL__: string;
declare const __MS_TEAMS_POWER_UP_ID__: string;
declare const __MS_TEAMS_POWER_UP_URL__: string;
declare const __GMAIL_POWER_UP_ID__: string;
declare const __GMAIL_POWER_UP_URL__: string;
declare const __E2B_ID__: string;
declare const __LOOM_API_KEY__: string;

export const slackTrelloDomain: string = __SLACK_TRELLO_DOMAIN__;
export const slackTrelloMicrosDomain: string = __SLACK_TRELLO_MICROS_DOMAIN__;
export const isDevserver: string = __DEVSERVER__;
export const slackDomain: string = __SLACK_DOMAIN__;
export const trelloForWebsites: string = __TRELLO_FOR_WEBSITES__;
export const customFieldsId: string = __CUSTOM_FIELDS_ID__;
export const firstPartyPluginsOrg: string = __FIRST_PARTY_PLUGINS_ORG__;
export const pluginCiOrg: string = __PLUGIN_CI_ORG__;
export const listLimitsPowerUpId: string = __LIST_LIMITS_POWERUP_ID__;
export const mapPowerUpId: string = __MAP_POWERUP_ID__;
export const bitbucketPowerUpId: string = __BITBUCKET_POWERUP_ID__;
export const attachmentsDomain: string = __ATTACHMENTS_DOMAIN__;
export const backgroundDomain: string = __BACKGROUND_DOMAIN__;
export const logoDomain: string = __LOGO_DOMAIN__;
export const oneDriveClientId: string = __ONE_DRIVE_CLIENT_ID__;
export const googleDriveClientId: string = __GOOGLE_DRIVE_CLIENT_ID__;
export const dropboxClientAppKey: string = __DROPBOX_CLIENT_APP_KEY__;
export const boxClientId: string = __BOX_CLIENT_ID__;
export const stripeApiKey: string = __STRIPE_API_KEY__;
export const googleMapsApiKey: string = __GOOGLE_MAPS_API_KEY__;
export const snowplowCloudfrontServer: string = __SNOWPLOW_CLOUDFRONT_SERVER__;
export const analyticsWebClientEnv: string = __ANALYTICS_WEB_CLIENT_ENV__;
export const analyticsWebClientApiHost: string = __ANALYTICS_WEB_CLIENT_API_HOST__;
export const launchdarklyKey: string = __LAUNCH_DARKLY_KEY__;
export const atlassianFeatureFlagClientKey: string = __ATLASSIAN_FEATURE_FLAG_CLIENT_KEY__;
export const environment: string = __ENV__;
export const appcuesAccountId: string = __APPCUES_ACCOUNT_ID__;
export const identityBaseUrl: string = __IDENTITY_BASE_URL__;
export const adminHubBaseUrl: string = __ADMIN_HUB_BASE_URL__;
export const atlassianApiGateway: string = __ATLASSIAN_API_GATEWAY__;
export const wacUrl: string = __WAC_URL__;
export const certcaptureGencertUrl: string = __CERTCAPTURE_GENCERT_URL__;
export const sentryDsn: string = __SENTRY_DSN__;
export const butlerApiBaseUrl: string = __BUTLER_API_BASE_URL__;
export const microsoftTeamsId: string = __MS_TEAMS_POWER_UP_ID__;
export const microsoftTeamsUrl: string = __MS_TEAMS_POWER_UP_URL__;
export const gmailId: string = __GMAIL_POWER_UP_ID__;
export const gmailUrl: string = __GMAIL_POWER_UP_URL__;
export const e2bId: string = __E2B_ID__;
export const loomApiKey: string = __LOOM_API_KEY__;

/**
 * Current build version information.
 *
 * It is critical that we use window.trelloVersion in the constructor, otherwise we bake the version number into the
 * javascript assets, resulting in cache invalidations for every new build.
 */
const trelloVersion: string = window?.trelloVersion ?? 'dev-0';
// eslint-disable-next-line @trello/no-module-logic
export const client = new Client(trelloVersion);
// eslint-disable-next-line @trello/no-module-logic
export const clientVersion: string = client.toString();

/**
 * Locale value is set in all the localized html templates,
 * so needs to be read from the window
 */
export const locale: string = window.locale || 'en';

/**
 * Reference to runtime site origin
 */
export const siteDomain: string =
  // eslint-disable-next-line @trello/no-module-logic
  location.origin || /^[^/]+?[/]{2}[^/]+/.exec(location.href)![0];
