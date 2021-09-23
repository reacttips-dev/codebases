import enviro from 'enviro';
import { includeScreen } from './includeScreen';
import { include3ColumnRecordGate } from './include3ColumnRecordGate';
import { BIZOPS_INTERACTION, CRM_API_ERROR, CRM_DEBUG, CRM_ONBOARDING, INDEX_INTERACTION, INTERNAL_CRM_TRACKING, RECORD_INTERACTION, SETTINGS_INTERACTION } from './constants/eventNames';
import requiredData from './constants/requiredData';
import { UsageTracker } from './tracker';
import { CRM, CALLING, SETTINGS, LISTS, QUOTES, PRODUCTS, LINEITEMS, COMMUNICATOR, REPORTING, TASKS } from './constants/namespaces';
import { objectTypeFromUrl } from './utils/objectTypeFromUrl';
var validNamespaces = [CRM, CALLING, SETTINGS, LISTS, QUOTES, PRODUCTS, LINEITEMS, COMMUNICATOR, REPORTING, TASKS];
var UsageLogger = {
  externalData: {},
  init: function init(data) {
    UsageLogger.externalData = data;
    UsageTracker.init(data);
  },
  logImmediate: function logImmediate(eventName) {
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var trackerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      namespace: CRM
    };
    return UsageLogger.log(eventName, eventProps, Object.assign({}, trackerOptions, {
      sendImmediate: true
    }));
  },
  log: function log(eventName) {
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var trackerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      sendImmediate: false,
      namespace: CRM
    };

    if (validNamespaces.indexOf(trackerOptions.namespace) === -1) {
      if (!enviro.isProd() && !enviro.deployed()) {
        console.warn("[UsageLogger]: " + trackerOptions.namespace + " is not a valid namespace. Event will not be logged");
      }
    } else {
      UsageLogger._log(eventName, eventProps, trackerOptions);
    }
  },
  _log: function _log() {
    var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var trackerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      sendImmediate: false,
      namespace: CRM
    };

    // some dynamic call sites are hard to migrate off of where_app_override
    // right now so this hydrates the namespace to make sure events go to the
    // right place
    if (eventProps.where_app_override && trackerOptions.namespace === 'crm') {
      trackerOptions.namespace = eventProps.where_app_override;
    }

    UsageTracker.track(eventName, eventProps, trackerOptions);
  },
  logEventAndProps: function logEventAndProps(properties) {
    var newProps = includeScreen(properties);

    if (newProps) {
      var event = newProps.event,
          _eventProps = newProps.eventProps;

      UsageLogger._log(event, _eventProps, properties.options);
    }
  },
  // New Logging Methods
  // Refer to: https://git.hubteam.com/HubSpot/CRM/issues/6661
  logSettingsInteraction: function logSettingsInteraction(objectType, eventProps) {
    return UsageLogger.logEventAndProps({
      event: SETTINGS_INTERACTION,
      objectType: objectType,
      eventProps: eventProps,
      options: {
        namespace: SETTINGS
      }
    });
  },
  logRecordInteraction: function logRecordInteraction(objectType, eventProps) {
    var eventData = {
      event: RECORD_INTERACTION,
      objectType: objectType,
      eventProps: eventProps
    };

    if (UsageLogger.externalData && UsageLogger.externalData[requiredData.OPTED_INTO_3_COLUMN]) {
      UsageLogger.externalData[requiredData.OPTED_INTO_3_COLUMN]().then(function (optedIn) {
        return include3ColumnRecordGate(eventData, optedIn);
      }).then(UsageLogger.logEventAndProps);
    } else {
      UsageLogger.logEventAndProps(eventData);
    }
  },
  logIndexInteraction: function logIndexInteraction(objectType, eventProps, options) {
    return UsageLogger.logEventAndProps({
      event: INDEX_INTERACTION,
      objectType: objectType,
      eventProps: eventProps,
      options: options
    });
  },
  logInternal: function logInternal(objectType, eventProps) {
    return UsageLogger.logEventAndProps({
      event: INTERNAL_CRM_TRACKING,
      objectType: objectType,
      eventProps: eventProps
    });
  },
  logCRMOnboarding: function logCRMOnboarding(objectType, eventProps) {
    return UsageLogger.logEventAndProps({
      event: CRM_ONBOARDING,
      objectType: objectType,
      eventProps: eventProps
    });
  },
  logError: function logError(objectType, eventProps) {
    return UsageLogger.logEventAndProps({
      event: CRM_API_ERROR,
      objectType: objectType,
      eventProps: eventProps
    });
  },
  logDebug: function logDebug(objectType, eventProps) {
    return UsageLogger.logEventAndProps({
      event: CRM_DEBUG,
      objectType: objectType,
      eventProps: eventProps
    });
  },
  logForBizOps: function logForBizOps(objectType, eventProps) {
    return UsageLogger.logEventAndProps({
      event: BIZOPS_INTERACTION,
      objectType: objectType,
      eventProps: eventProps
    });
  },
  forNewPortals: function forNewPortals(logger, objectType, eventProps) {
    if (UsageLogger.externalData && UsageLogger.externalData[requiredData.PORTAL_AGE_DAYS]) {
      UsageLogger.externalData[requiredData.PORTAL_AGE_DAYS]().then(function (age) {
        var isNewPortal = age < 1;
        var isDebugging = enviro.debug('firstDayLogging');

        if (isDebugging || isNewPortal) {
          logger(objectType, eventProps);
        }
      });
    }
  }
};
var CommunicatorLogger = {
  log: function log(eventName) {
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!Object.prototype.hasOwnProperty.call(eventProps, 'screen')) {
      eventProps.screen = objectTypeFromUrl();
    }

    UsageLogger.log(eventName, eventProps, {
      namespace: COMMUNICATOR
    });
  },
  logImmediate: function logImmediate(eventName) {
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    eventProps.screen = objectTypeFromUrl();
    UsageLogger.logImmediate(eventName, eventProps, {
      namespace: COMMUNICATOR
    });
  }
};
var SettingsLogger = {
  log: function log(eventName, eventProps) {
    return UsageLogger.log(eventName, eventProps, {
      namespace: SETTINGS
    });
  },
  logImmediate: function logImmediate(eventName, eventProps) {
    return UsageLogger.logImmediate(eventName, eventProps, {
      namespace: SETTINGS
    });
  }
};
var ListsLogger = {
  log: function log(eventName, eventProps) {
    return UsageLogger.log(eventName, eventProps, {
      namespace: LISTS
    });
  },
  logImmediate: function logImmediate(eventName, eventProps) {
    return UsageLogger.logImmediate(eventName, eventProps, {
      namespace: LISTS
    });
  }
};
var QuotesLogger = {
  log: function log(eventName, eventProps) {
    return UsageLogger.log(eventName, eventProps, {
      namespace: QUOTES
    });
  },
  logImmediate: function logImmediate(eventName, eventProps) {
    return UsageLogger.logImmediate(eventName, eventProps, {
      namespace: QUOTES
    });
  }
};
var ProductsLogger = {
  log: function log(eventName, eventProps) {
    return UsageLogger.log(eventName, eventProps, {
      namespace: PRODUCTS
    });
  },
  logImmediate: function logImmediate(eventName, eventProps) {
    return UsageLogger.logImmediate(eventName, eventProps, {
      namespace: PRODUCTS
    });
  }
};
var LineItemsLogger = {
  log: function log(eventName, eventProps) {
    return UsageLogger.log(eventName, eventProps, {
      namespace: LINEITEMS
    });
  },
  logImmediate: function logImmediate(eventName, eventProps) {
    return UsageLogger.logImmediate(eventName, eventProps, {
      namespace: LINEITEMS
    });
  }
};
var ReportingLogger = {
  log: function log(eventName, eventProps) {
    return UsageLogger.log(eventName, eventProps, {
      namespace: REPORTING
    });
  },
  logImmediate: function logImmediate(eventName, eventProps) {
    return UsageLogger.logImmediate(eventName, eventProps, {
      namespace: REPORTING
    });
  }
};
export { UsageLogger as CrmLogger, CommunicatorLogger, SettingsLogger, ListsLogger, QuotesLogger, ProductsLogger, LineItemsLogger, ReportingLogger };