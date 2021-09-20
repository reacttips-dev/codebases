import { isServedFromPublicWorkspaceDomain } from '../../appsdk/utils/commonWorkspaceUtils';

const target = window.SDK_PLATFORM,
  channel = __WP_RELEASE_CHANNEL__,
  DEFAULT_CONFIG_TYPE = 'default',
  GW_CONFIG_TYPE = 'gw',
  CURRENT_CONFIG_TYPE = _getConfigType(),
  VALID_CONFIG_TYPES = {
    browser: new Set([DEFAULT_CONFIG_TYPE, GW_CONFIG_TYPE]),
    desktop: new Set([DEFAULT_CONFIG_TYPE])
  };

let cachedConfigs = {};

Object.keys(VALID_CONFIG_TYPES).forEach((platform) => {
  cachedConfigs[platform] = {};
});

/**
 * Returns the config type based on domain
 *
 * @return {String}
 */
function _getConfigType () {
  if (target === 'browser' && isServedFromPublicWorkspaceDomain()) {
    return GW_CONFIG_TYPE;
  }
  return DEFAULT_CONFIG_TYPE;
}

/**
 * Returns a combination of the base config and the respective channel config
 *
 * @param {Object} configType
 */
function _getMergedConfig (configType) {
  if (!(VALID_CONFIG_TYPES[target] && VALID_CONFIG_TYPES[target].has(configType))) {
    const configNotFoundErr = `AppConfiguration~_getMergedConfig - ${configType} config type does not exist for ${target} platform`;

    // In the initialization sequence bootConfig (which initiliazes the config API) runs
    // before the Logger initialization. So we need a safe check here. This can be avoided if we
    // move the Logger initialization to preload script (SDK APIs).
    pm.logger && pm.logger.warn(configNotFoundErr) || console.warn(configNotFoundErr);
    return;
  }

  if (cachedConfigs[target][configType]) {
    return cachedConfigs[target][configType];
  }

  // postman-skip-import-validation
  const baseConfig = require(`../../../../config/environments/${configType}/${target}/base.json`),

    // postman-skip-import-validation
    channelConfig = require(`../../../../config/environments/${configType}/${target}/${channel}.json`),
    mergedConfig = Object.assign({}, baseConfig, channelConfig);

  return cachedConfigs[target][configType] = mergedConfig;
}

/**
 * Removes `''` from the given value
 *
 * @param {Object} proxyConfig
 *
 * @returns {Object}
 */
function _sanitizeConfigValue (value) {
  if (typeof value === 'string') {
    return value.replace(/\'/g, '');
  }

  if (typeof value === 'object' && value !== null) {
    Object.keys(value).forEach((key) => {
      value[key] = _sanitizeConfigValue(value[key]);
    });
  }

  return value;
}

/**
 * This provides the necessary abstraction for retrieving environment variables for
 * different configuration types or environments.
 */
let appConfig = {
  /**
   * Retrieves the config variables from `config/environment/*`. It serves config from `gw` directory
   * for public workspaces domain and for others it serves from `default` directory. If config type is specified
   * then it will return config values from that.
   *
   * @param {String} key This key should be defined in `config/environments/*` in the respective configuration
   *    depending on the type of environment or configuration. Type supported are 'default' and 'gw'.
   * @param {String} configType This indicates from which config type the value should be returned from. Type supported are
   *    'default' and 'gw'.
   *
   * @return {String}
   */
  get (key, configType = '') {
    !configType && (configType = CURRENT_CONFIG_TYPE);

    let config = _getMergedConfig(configType),
      value = config && _sanitizeConfigValue(config[key]);

    if (typeof value !== 'undefined') {
      return value;
    }

    const err = {
      message: `No value found for the key ${key}`
    };

    // In the initialization sequence bootConfig (which initiliazes the config API) runs
    // before the Logger initialization. So we need a safe check here. This can be avoided if we
    // move the Logger initialization to preload script (SDK APIs).
    pm.logger && pm.logger.warn('AppConfiguration~get - Failed to get value from config', err) ||
    console.warn('AppConfiguration~get - Failed to get value from config', err);
  }
};

export default appConfig;
