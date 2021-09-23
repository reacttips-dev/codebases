'use es6';

import { getPrimaryTracker } from 'usage-tracker-container';
export var create = function create(version) {
  var tracker = null;

  try {
    tracker = getPrimaryTracker().clone({
      events: {
        experimentExposure: {
          name: 'product experiment exposure',
          class: 'exposure',
          version: version,
          properties: {
            experimentName: 'string',
            experimentParams: 'string'
          }
        }
      },
      properties: {
        namespace: 'hublabs'
      }
    });
  } catch (err) {
    /* NOOP */
  }

  return tracker;
};
export var trackExposure = function trackExposure(track, eventProperties) {
  track('experimentExposure', eventProperties);
};