'use es6';

import * as schema from './common/schema';
import { configError } from './common/messages';
import { safeGetOrDefault } from './common/helpers';
export var eventClasses = ['activation', 'creation', 'error', 'exposure', 'funnel', 'interaction', 'none', 'signup', 'usage', 'view', 'warning'];
export var eventPropertyTypes = ['boolean', 'string', 'number', 'array'];
/*
 *  Schema for createClient() function args
 */

export var clientDependenciesSchema = schema.create('client dependency', configError, {
  clientName: {
    types: ['string'],
    default: 'custom'
  },
  getDebug: {
    types: ['function']
  },
  getEmail: {
    types: ['function']
  },
  getHubId: {
    types: ['function']
  },
  getHstc: {
    types: ['function']
  },
  getLang: {
    types: ['function']
  },
  getCurrentHref: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['window', 'location', 'href'], '');
    }
  },
  getReferrer: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['document', 'referrer'], '');
    }
  },
  getUserAgent: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['navigator', 'userAgent'], '');
    }
  },
  getNetworkType: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['navigator', 'connection', 'effectiveType'], '');
    }
  },
  getNetworkSpeed: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['navigator', 'connection', 'downlink'], '');
    }
  },
  getScreenWidth: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['screen', 'width'], '');
    }
  },
  getScreenHeight: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['screen', 'height'], '');
    }
  },
  getWindowWidth: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['window', 'innerWidth'], '');
    }
  },
  getWindowHeight: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['window', 'innerHeight'], '');
    }
  },
  getDeployableName: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['window', 'hubspot', 'bender', 'currentProject'], '');
    }
  },
  getDeployableVersion: {
    types: ['function'],
    default: function _default() {
      return safeGetOrDefault(['window', 'hubspot', 'bender', 'currentProjectVersion'], '');
    }
  },
  getTempStorage: {
    types: ['function']
  },
  setTempStorage: {
    types: ['function']
  },
  logMessage: {
    types: ['function'],
    default: function _default(msg) {
      if (typeof safeGetOrDefault(['console', 'log'], '') === 'function') {
        console.log(msg);
      }
    }
  },
  logError: {
    types: ['function'],
    default: function _default(err) {
      if (typeof safeGetOrDefault(['console', 'error'], '') === 'function') {
        console.error(err);
      }
    }
  },
  reportError: {
    types: ['function']
  },
  send: {
    types: ['function']
  }
});
/*
 *  Schema for createTracker() function args
 */

export var trackerConfigSchema = schema.create('config option', configError, {
  events: {
    types: ['object']
  },
  properties: {
    types: ['object'],
    default: {}
  },
  debug: {
    types: ['boolean', 'function']
  },
  onError: {
    types: ['function']
  },
  onScheduled: {
    types: ['function'],
    default: function _default() {}
  },
  allowUnauthed: {
    types: ['boolean'],
    default: false
  },
  bypassPool: {
    types: ['boolean'],
    default: false
  },
  isBeforeUnload: {
    types: ['boolean'],
    default: false
  },
  isExternalHost: {
    types: ['boolean'],
    default: false
  },
  lastKnownEventProperties: {
    types: ['array'],
    default: []
  },
  preserveTrackerProperties: {
    types: ['boolean'],
    default: true
  }
});
/*
 *  Schema for tracker properties
 */

export var trackerPropertiesSchema = schema.create('tracker properties', configError, {
  email: {
    types: ['string', 'function', 'object']
  },
  hubId: {
    types: ['number', 'function', 'object']
  },
  hstc: {
    types: ['string', 'function', 'object']
  },
  lang: {
    types: ['string', 'function', 'object']
  }
}, false);
/*
 *  Schema for events.yaml definitions
 */

export var eventDefinitionSchema = schema.create('event property', configError, {
  name: {
    types: ['string']
  },
  namespace: {
    types: ['string'],
    default: ''
  },
  class: {
    types: ['string'],
    oneOf: eventClasses
  },
  version: {
    types: ['string'],
    default: 'v1'
  },
  properties: {
    types: ['object'],
    default: {}
  }
});
/*
 *  Schema for events.yaml event properties
 */

export var eventPropertySchema = schema.create('event property', configError, {
  type: {
    types: ['string', 'array'],
    oneOf: eventPropertyTypes
  },
  isOptional: {
    types: ['boolean'],
    default: false
  }
});