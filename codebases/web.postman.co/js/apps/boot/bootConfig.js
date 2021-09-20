import appConfig from '../../services/AppConfiguration';

let remote = require('electron').remote;

window.pm = window.pm || {};
window.pm.config = appConfig;

window.postman_syncserver_url = pm.config.get('__WP_SYNCSERVER_URL__');
window.postman_publiclinkserver_url = pm.config.get('__WP_PUBLICLINKSERVER_URL__');
window.postman_ga_tracking_id = pm.config.get('__WP_GA_TRACKING_ID__');
window.postman_env = pm.config.get('__WP_ENV__');
window.postman_sync_rawtext_limit = pm.config.get('__WP_SYNC_RAWTEXT_LIMIT__');
window.postman_scribe_url = pm.config.get('__WP_SCRIBE_URL__');
window.postman_documentation_preview_url = pm.config.get('__WP_DOCUMENTATION_PREVIEW_URL__');
window.postman_monitors_url = pm.config.get('__WP_MONITORS_URL__');
window.postman_run_btn_url = pm.config.get('__WP_RUN_BTN_URL__');
window.postman_update_server_url = pm.config.get('__WP_UPDATE_SERVER_URL__');
window.postman_linkservice_url = pm.config.get('__WP_LINKSERVICE_URL__');
window.postman_analytics_url = pm.config.get('__WP_ANALYTICS_URL__');
window.postman_templates_url = pm.config.get('__WP_TEMPLATES_URL__');
window.postman_publishing_url = pm.config.get('__WP_PUBLISHING_SERVICE_URL__');
window.postman_app_url = pm.config.get('__WP_APP_URL__');
window.postman_runtime_agent_port = pm.config.get('__WP_RUNTIME_AGENT_PORT__');
window.postman_runtime_agent_service_url = pm.config.get('__WP_RUNTIME_AGENT_SERVICE_URL__');
window.postman_integrations_public_url = pm.config.get('__WP_INTEGRATIONS_PUBLIC_URL__');
window.postman_gateway_http_private_url = pm.config.get('__WP_HTTPS_GATEWAY_PRIVATE_URL__');
window.postman_gateway_http_public_url = pm.config.get('__WP_HTTPS_GATEWAY_PUBLIC_URL__');

window.ENABLE_CRASH_REPORTING = pm.config.get('__WP_ENABLE_CRASH_REPORTING__');
window.SENTRY_DSN = pm.config.get('__WP_SENTRY_DSN__');
window.DISABLE_ANALYTICS = pm.config.get('__WP_DISABLE_ANALYTICS__');
window.ENABLE_ANALYTICS_LOG = pm.config.get('__WP_ENABLE_ANALYTICS_LOG__');
window.RELEASE_CHANNEL = pm.config.get('__WP_RELEASE_CHANNEL__');
window.INTERCEPTOR_ID = pm.config.get('__WP_INTERCEPTOR_APP_ID__');
window.GOD_INTEGRATIONS_URL = pm.config.get('__WP_GOD_INTEGRATIONS__URL');

// We need two separate URLs here - one for profiles/teams and the other for explore itself
// - postman_explore_url is used to build the profile/team page URLs etc
// - postman_explore_redirect_url is used to redirect to explore whenever appropriate (for example on finding an empty workspace)
window.postman_explore_url = pm.config.get('__WP_EXPLORE_URL__');
window.postman_explore_redirect_url = `${pm.config.get('__WP_EXPLORE_URL__')}/explore`;


// Artemis specific environment variables
if (window.SDK_PLATFORM === 'browser') {
  window.postman_static_assets_url = pm.config.get('__WP_STATIC_ASSETS_BASE_URL__');
  window.postman_agent_download_url = pm.config.get('__WP_POSTMAN_AGENT_DOWNLOAD_URL__');
  window.postman_artemis_domain = pm.config.get('__WP_ARTEMIS_DOMAIN__');
  window.postman_cloud_agent_service_url = pm.config.get('__WP_CLOUD_AGENT_SERVICE_URL__');
}

// Collections that are imported by Postman. Currently, only the echo collection
window.postman_predef_collections = ['f695cab7-6878-eb55-7943-ad88e1ccfd65'];

let windowConfig,
    env = _.assign({
        DISABLE_UPDATES: __WP_DISABLE_UPDATES__
      }, remote.process.env); // This is the same as remote.getGlobal('process') but is cached

/**
 *
 * @param {*} cb
 */
function bootConfig (cb) {
  console.log('Initializing the global config');
  _.assign(window.pm, {
    logger: console,
    webUrl: pm.config.get('__WP_WEB_URL__'),
    identityUrl: pm.config.get('__WP_IDENTITY_URL__'),
    identityApiUrl: pm.config.get('__WP_IDENTITY_API_URL__'),
    apiUrl: pm.config.get('__WP_API_URL__'),
    appUrl: pm.config.get('__WP_APP_URL__'),
    dashboardUrl: pm.config.get('__WP_DASHBOARD_URL__'),
    trustedDomains: pm.config.get('__WP_TRUSTED_DOMAINS__'),
    onboardingServiceUrl: pm.config.get('__WP_ONBOARDING_SERVICE_URL__'),
    artemisUrl: pm.config.get('__WP_ARTEMIS_URL__'),
    env,
    windowConfig
  });

  return cb(null);
}

export const Config = {
  init: function (config) {
    windowConfig = config;
    return bootConfig;
  }
};
