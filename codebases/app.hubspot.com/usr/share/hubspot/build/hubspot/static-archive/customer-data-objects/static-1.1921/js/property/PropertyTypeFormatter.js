'use es6';

import I18n from 'I18n';
export var formatDuration = function formatDuration(value) {
  if (value == null || isNaN(value) || value === '') {
    return value;
  }

  return I18n.moment.duration(parseInt(value, 10)).humanize();
};