'use es6';

import I18n from 'I18n';
export var getDaysInTrialRemaining = function getDaysInTrialRemaining(timestamp) {
  return I18n.moment(timestamp).diff(I18n.moment(), 'days') + 1;
};