import { GET } from 'unified-navigation-ui/utils/API';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { get, set } from 'unified-navigation-ui/js/utils/tempStorage';
export function getConfig(configCallback) {
  var path = "/navconfig/v2/navconfig" + (getPortalId() ? "?portalId=" + getPortalId() : '/homepage');

  var onError = function onError() {
    var portalId = getPortalId();
    var navConfigs = JSON.parse(get('hubspot_navconfigs') || '{}');

    if (portalId && navConfigs[portalId] && configCallback) {
      configCallback(navConfigs[portalId]);
    }
  };

  var setGoodRes = function setGoodRes(res) {
    var portalId = getPortalId();
    var navConfigs = JSON.parse(get('hubspot_navconfigs') || '{}');

    if (res.isAccurate && portalId) {
      navConfigs[portalId] = res;
      set('hubspot_navconfigs', JSON.stringify(navConfigs));
    }

    return configCallback ? configCallback(portalId && navConfigs[portalId] || res) : null;
  };

  GET(path, setGoodRes, {
    localOverride: 'NAVIGATION_CONFIG_ENV',
    subDomain: 'app',
    maxRetries: 5,
    onError: onError
  });
}
export function getHublessConfig(configCallback) {
  var path = '/navconfig/v2/navconfig/hubless';
  GET(path, configCallback, {
    localOverride: 'NAVIGATION_CONFIG_ENV',
    maxRetries: 5
  });
}