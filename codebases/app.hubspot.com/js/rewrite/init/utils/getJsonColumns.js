'use es6';

import Raven from 'Raven';
export var getJsonColumns = function getJsonColumns(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (err) {
    Raven.captureException('Failed to parse grid column query param JSON', {
      extra: {
        err: err,
        value: value
      }
    });
    return null;
  }
};