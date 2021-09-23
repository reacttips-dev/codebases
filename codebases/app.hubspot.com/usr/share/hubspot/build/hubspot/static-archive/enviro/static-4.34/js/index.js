"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var createEnviro = function createEnviro(location) {
  var deployedRe = /^(?!local|test|selenium)(.*\.)?((?:hubspot|hubteam|grader|getsignals|getsidekick|gettally|leadin|hubspotemail|customer-hub|hubspotservicehub)(qa)?\.com|(?:hubspotstarter|hubspotfree)(qa)?\.net|(?:growth)(qa)?\.org)$/;
  var isDeployed = deployedRe.test(location.hostname);
  var qaRe = /(?:hubspot|hubteam|grader|getsignals|getsidekick|gettally|leadin|hubspotemail|customer-hub|hubspotservicehub)qa\.com|(?:hubspotstarter|hubspotfree)qa\.net|(?:growth)qa\.org/;
  var hubletRe = /^(?:api|local|app|private|platform|tools)-(.*).(?:hubspot|hubteam)(?:qa)?.com/;
  var defaultKey = 'ENV';
  var DEFAULT_NOT_SUPPORTED_ERROR_MSG = 'Enviro error: the default argument for .get and .getShort is no longer supported';

  var getEnv = function getEnv(key) {
    var result = window[key];

    if (result == null) {
      try {
        result = window.sessionStorage.getItem(key);
      } catch (e) {}
    }

    if (result == null) {
      try {
        result = window.localStorage.getItem(key);
      } catch (e) {}
    }

    return result;
  };

  var getDefaultEnv = function getDefaultEnv() {
    var env = getEnv(defaultKey);

    if (env) {
      return env;
    } else if (qaRe.test(location.host)) {
      return 'qa';
    } else {
      return 'prod';
    }
  };

  var setEnv = function setEnv(key, env) {
    window[key] = env;
    return env;
  };

  var MAP = {
    prod: 'production',
    qa: 'development'
  };

  var normalize = function normalize(env) {
    if (typeof env === 'string') {
      var lower = env.toLowerCase();
      return MAP[lower] || lower;
    }

    return env;
  };

  var denormalize = function denormalize(env) {
    env = typeof env === 'string' ? env.toLowerCase() : undefined;
    return Object.keys(MAP).find(function (ours) {
      return env === MAP[ours];
    }) || env;
  };

  var get = function get(service, defaultVal) {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }

    var env = null;

    if (service) {
      var parts = service.split('.').reverse();

      for (var i = 0; i < parts.length; i++) {
        var pathPart = parts[i];
        env = getEnv(pathPart.toUpperCase() + "_ENV");

        if (env) {
          break;
        }
      }
    }

    if (env == null) {
      var defaultEnv = getDefaultEnv();
      env = defaultEnv != null ? defaultEnv : 'qa';
    }

    return normalize(env);
  };

  var set = function set(key, env) {
    if (arguments.length === 1) {
      env = key;
      key = defaultKey;
    }

    return setEnv(key, env);
  };

  var getInternal = function getInternal(service, defaultVal) {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }

    return denormalize(get(service));
  };

  var getShort = getInternal;

  var isProd = function isProd(service) {
    return getShort(service) === 'prod';
  };

  var isQa = function isQa(service) {
    return getShort(service) === 'qa';
  };

  var deployed = function deployed(service) {
    var result;

    if (typeof service === 'string') {
      result = getEnv(service.toUpperCase() + "_DEPLOYED");
    }

    if (result == null) {
      result = getEnv('DEPLOYED');
    }

    return result == null ? isDeployed : !!result;
  };

  var debug = function debug(service) {
    var defaultVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var result;

    if (typeof service === 'string') {
      result = getEnv(service.toUpperCase() + "_DEBUG");
    }

    if (result == null) {
      result = getEnv('DEBUG');
    }

    return result == null ? defaultVal : result;
  };

  var setDebug = function setDebug(service) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof service === 'string') {
      try {
        if (val) {
          localStorage.setItem(service.toUpperCase() + "_DEBUG", true);
        } else {
          localStorage.removeItem(service.toUpperCase() + "_DEBUG");
        }
      } catch (e) {
        setEnv(service.toUpperCase() + "_DEBUG", val || undefined);
      }
    } else {
      val = service != null ? service : true;

      try {
        if (val) {
          localStorage.setItem('DEBUG', val);
        } else {
          localStorage.removeItem('DEBUG');
        }
      } catch (e) {
        setEnv('DEBUG', val || undefined);
      }
    }
  };

  var enabled = function enabled(service) {
    var defaultVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var result = getEnv(service.toUpperCase() + "_ENABLED");

    if (result == null) {
      result = defaultVal;
    }

    return ("" + result).toLowerCase() === 'true';
  };

  var getHublet = function getHublet() {
    var hubletOverride = getEnv('HUBLET');

    if (hubletOverride) {
      return hubletOverride;
    } else if (hubletRe.test(location.hostname)) {
      return hubletRe.exec(location.hostname)[1];
    }

    return 'na1';
  };

  return {
    createEnviro: createEnviro,
    debug: debug,
    denormalize: denormalize,
    deployed: deployed,
    enabled: enabled,
    get: get,
    getHublet: getHublet,
    getInternal: getInternal,
    getShort: getShort,
    isProd: isProd,
    isQa: isQa,
    normalize: normalize,
    set: set,
    setDebug: setDebug
  };
};

var _default = createEnviro(document.location);

exports.default = _default;
module.exports = exports.default;