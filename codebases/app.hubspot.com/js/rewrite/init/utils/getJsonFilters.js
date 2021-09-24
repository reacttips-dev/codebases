'use es6';

import Raven from 'Raven';
export var getJsonFilters = function getJsonFilters(value) {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (err) {
    Raven.captureException(err, {
      extra: {
        value: value
      }
    });
    return JSON.parse(value);
  }
};