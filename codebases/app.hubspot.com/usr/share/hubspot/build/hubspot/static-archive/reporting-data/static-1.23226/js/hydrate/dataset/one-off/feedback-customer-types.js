'use es6';

import I18n from 'I18n';
import { List, Map as ImmutableMap } from 'immutable';
import { has } from '../../../lib/has';
import { UNIFIED_FEEDBACK_TRENDS } from '../../../constants/dataTypes';

var translate = function translate(key) {
  return function () {
    return I18n.text("reporting-data.properties.unified-feedback-trends." + key);
  };
};

var customerTypes = {
  detractorsCount: {
    NPS: translate('npsDetractorsCount'),
    CES: translate('cesDetractorsCount'),
    CSAT: translate('csatDetractorsCount')
  },
  passivesCount: {
    NPS: translate('npsPassivesCount'),
    CES: translate('cesPassivesCount'),
    CSAT: translate('csatPassivesCount')
  },
  promotersCount: {
    NPS: translate('npsPromotersCount'),
    CES: translate('cesPromotersCount'),
    CSAT: translate('csatPromotersCount')
  }
};
export var precondition = function precondition(property, config) {
  return config.get('dataType') === UNIFIED_FEEDBACK_TRENDS && has(customerTypes, property);
};
export var format = function format(property, config) {
  var surveyTypes = customerTypes[property] || {};
  var filters = config.getIn(['filters', 'custom'], List());
  var surveyType = filters.find(function (filter) {
    return filter.get('property') === 'surveyType';
  }, null, ImmutableMap()).get('value');
  return surveyType && has(surveyTypes, surveyType) ? surveyTypes[surveyType]() : null;
};