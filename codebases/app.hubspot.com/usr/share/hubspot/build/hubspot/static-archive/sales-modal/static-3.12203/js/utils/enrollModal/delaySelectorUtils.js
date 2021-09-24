'use es6';

import I18n from 'I18n';
import * as DelayOptionTypes from 'sales-modal/constants/DelayOptionTypes';
export var getDelayOptions = function getDelayOptions() {
  return Object.keys(DelayOptionTypes).map(function (key) {
    return {
      text: I18n.text("enrollModal.delaySelector.delayOptions." + key),
      value: DelayOptionTypes[key]
    };
  });
};