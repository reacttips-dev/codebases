'use es6';

import { debugLog, configError, genericError } from './common/messages';
import { defaults, omit, shallowCopy, resolveAsyncProperties } from './common/helpers';
import { trackerConfigSchema, trackerPropertiesSchema } from './schemas';

var getDefinition = function getDefinition(_ref, eventKey, eventProperties) {
  var events = _ref.events,
      logError = _ref.logError,
      onError = _ref.onError,
      dictionaryLookup = _ref.dictionaryLookup;

  try {
    return dictionaryLookup(events, eventKey, eventProperties);
  } catch (err) {
    var stringifiedProperties = 'error parsing properties';

    try {
      stringifiedProperties = JSON.stringify(eventProperties);
    } catch (err2) {
      /* NOOP */
    }

    onError(err, {
      extra: {
        eventProperties: stringifiedProperties
      }
    });
    logError(err);
    return null;
  }
};

var getIdentifiers = function getIdentifiers(_ref2, _ref3) {
  var createIdentifiers = _ref2.createIdentifiers,
      allowUnauthed = _ref2.allowUnauthed,
      isExternalHost = _ref2.isExternalHost,
      logError = _ref2.logError,
      onError = _ref2.onError;
  var email = _ref3.email,
      userId = _ref3.userId,
      hubId = _ref3.hubId,
      hstc = _ref3.hstc,
      deviceId = _ref3.device_id,
      hasDeviceIdOverride = _ref3.hasDeviceIdOverride;

  try {
    return createIdentifiers({
      email: email,
      userId: userId,
      hubId: hubId,
      hstc: hstc,
      deviceId: hasDeviceIdOverride ? deviceId : null
    }, {
      allowUnauthed: allowUnauthed,
      isExternalHost: isExternalHost
    });
  } catch (err) {
    onError(err);
    logError(err);
    return null;
  }
};

var createEvent = function createEvent(_ref4, definition, identifiers, eventProperties) {
  var createEventPayload = _ref4.createEventPayload,
      logError = _ref4.logError,
      onError = _ref4.onError;

  try {
    return createEventPayload(definition, eventProperties, identifiers);
  } catch (err) {
    onError(err);
    logError(err);
    return null;
  }
};

var debugEvent = function debugEvent(_ref5, eventKey, eventProperties, event) {
  var logMessage = _ref5.logMessage;
  logMessage(debugLog('event scheduled to be sent', {
    eventKey: "\"" + eventKey + "\"",
    eventName: event.what_event,
    eventNamespace: event.where_app
  }));
  var prettifiedPayload = JSON.parse(JSON.stringify(event));
  prettifiedPayload.what_extra_json = JSON.parse(prettifiedPayload.what_extra_json);
  logMessage(prettifiedPayload);
};

var onScheduled = function onScheduled(config, eventKey, eventProperties, event) {
  var debug = typeof config.debug === 'function' ? config.debug() : config.debug;

  if (typeof config.onScheduled === 'function') {
    config.onScheduled(eventKey);
  }

  if (debug) {
    try {
      debugEvent(config, eventKey, eventProperties, event);
    } catch (err) {
      /* NoOp */
    }
  }
};

var trackEvent = function trackEvent(config, eventKey, eventProperties) {
  var definition = getDefinition(config, eventKey, eventProperties);
  if (!definition) return false;
  var identifiers = getIdentifiers(config, eventProperties);
  if (!identifiers) return false;
  delete eventProperties.hasDeviceIdOverride;
  var event = createEvent(config, definition, identifiers, eventProperties);
  if (!event) return false;
  config.scheduleEvent(config, identifiers, eventKey, event);
  onScheduled(config, eventKey, eventProperties, event);
  return true;
};

var parseConfig = function parseConfig(trackerDependencies, config) {
  if (!config || typeof config !== 'object') {
    throw configError("Invalid argument. The \"createTracker\" function requires to be passed a config argument of type \"object\". Received type \"" + typeof config + "\".");
  }
  /*
   *  Apply defualts to schemas.
   *  Defaults such as onError are not known until runtime.
   */


  var trackerConfigSchemaWithDefaults = trackerConfigSchema.mutate(function (schema) {
    schema.debug.default = trackerDependencies.getDebug;
    schema.onError.default = trackerDependencies.reportError;
    return schema;
  });
  var trackerPropertiesSchemaWithDefaults = trackerPropertiesSchema.mutate(function (schema) {
    schema.email.default = trackerDependencies.getEmail;
    schema.hubId.default = trackerDependencies.getHubId;
    schema.hstc.default = trackerDependencies.getHstc;
    schema.lang.default = trackerDependencies.getLang;
    return schema;
  });
  /*
   *  Normalize & validate tracker config + properties.
   */

  var parsedConfig = trackerConfigSchemaWithDefaults.normalize(config);
  trackerConfigSchemaWithDefaults.validate(parsedConfig, '"createTracker"');
  var parsedTrackerProperties = trackerPropertiesSchemaWithDefaults.normalize(parsedConfig.properties);
  trackerPropertiesSchemaWithDefaults.validate(parsedTrackerProperties, '"createTracker"');
  var dictionary = trackerDependencies.createDictionary(parsedConfig.events, '"createTracker"');
  return Object.assign({
    events: dictionary,
    properties: parsedTrackerProperties
  }, omit(parsedConfig, ['events', 'properties']), {}, trackerDependencies);
};

export var createLockedTracker = function createLockedTracker(trackerDependencies) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parsedConfig = parseConfig(trackerDependencies, config);
  var lastKnownPropertyCache = {};
  var properties = Object.assign({}, parsedConfig.properties);
  var propertiesAreDirty = true;
  /*
   *  Syncs lastKnownEventProperties each
   *  time an event is tracked with eventProperties.
   */

  var lastKnownPropertyCacheSync = function lastKnownPropertyCacheSync(eventProperties) {
    if (parsedConfig.lastKnownEventProperties && parsedConfig.lastKnownEventProperties.length) {
      parsedConfig.lastKnownEventProperties.forEach(function (key) {
        var value = eventProperties[key];

        if (value !== undefined) {
          lastKnownPropertyCache[key] = value;
        } else {
          value = lastKnownPropertyCache[key];
        }

        if (value && value !== properties[key]) {
          properties[key] = value;
        }
      });
    }
  };

  return {
    clone: function clone() {
      var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!overrides || typeof overrides !== 'object') {
        throw genericError("Invalid argument. The \"clone\" method requires to be passed a valid tracker config of type \"object\". Received type \"" + typeof overrides + "\".");
      }

      var mergedConfig = omit(defaults(overrides, parsedConfig), Object.keys(trackerDependencies));
      var supportedProperties = omit(properties, trackerPropertiesSchema.getKeys(), false);
      var arbitraryProperties = omit(properties, Object.keys(supportedProperties));
      mergedConfig.properties = defaults(overrides.properties || {}, supportedProperties);

      if (parsedConfig.preserveTrackerProperties) {
        mergedConfig.properties = defaults(mergedConfig.properties, arbitraryProperties);
      }

      return createLockedTracker(trackerDependencies, mergedConfig);
    },
    config: Object.assign({}, omit(parsedConfig, ['properties']), {
      properties: properties
    }),
    setProperties: function setProperties() {
      var newProperties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!newProperties || typeof newProperties !== 'object') {
        throw genericError("Invalid argument. The \"setProperties\" method requires to be passed a properties argument of type \"object\". Received type \"" + typeof newProperties + "\".");
      }

      Object.keys(newProperties).forEach(function (key) {
        var value = newProperties[key];
        properties[key] = value;
      });
      propertiesAreDirty = true;
    },
    track: function track(eventKey) {
      var eventProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!eventKey || typeof eventKey !== 'string') {
        throw genericError("Invalid argument. The \"track\" method requires to be passed an eventKey of type \"string\". Received type \"" + typeof eventKey + "\".");
      }

      if (!eventProperties || typeof eventProperties !== 'object') {
        throw genericError("Invalid argument. The \"track\" method requires the 2nd arg to be passed eventProperties of type \"object\". Received type \"" + typeof eventProperties + "\".");
      }

      var eventPropertiesCopy = Object.assign({}, eventProperties, {
        eventKey: eventKey
      });
      var arbitraryProperties = defaults(eventPropertiesCopy, shallowCopy(properties));
      var metaProperties = shallowCopy(parsedConfig.getMetaProperties({
        deviceIdOverride: arbitraryProperties.deviceId
      }));
      var mergedProperties = defaults(arbitraryProperties, metaProperties);
      lastKnownPropertyCacheSync(mergedProperties);

      if (propertiesAreDirty) {
        resolveAsyncProperties(properties, parsedConfig.onError, function (resolved) {
          properties = defaults(resolved, properties);
          propertiesAreDirty = false;
          arbitraryProperties = defaults(eventPropertiesCopy, shallowCopy(properties));
          mergedProperties = defaults(arbitraryProperties, metaProperties);
          trackEvent(parsedConfig, eventKey, mergedProperties);
        });
      } else {
        trackEvent(parsedConfig, eventKey, mergedProperties);
      }
    }
  };
};